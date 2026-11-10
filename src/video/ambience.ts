function writeString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index))
}

export function audioBufferToWav(buffer: AudioBuffer) {
  const channels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const frames = buffer.length
  const bytesPerSample = 2
  const block = channels * bytesPerSample
  const dataSize = frames * block
  const out = new ArrayBuffer(44 + dataSize)
  const view = new DataView(out)
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * block, true)
  view.setUint16(32, block, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)
  const sources = Array.from({ length: channels }, (_, index) => buffer.getChannelData(index))
  let offset = 44
  for (let frame = 0; frame < frames; frame += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, sources[channel][frame]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }
  return out
}

/** Soft pad and room noise. Same buffer drives preview playback and the exported track. */
export async function renderAmbience(duration: number) {
  const seconds = Math.max(0.5, duration)
  const sampleRate = 48000
  const context = new OfflineAudioContext(2, Math.ceil(sampleRate * seconds), sampleRate)
  const master = context.createGain()
  const intro = Math.min(0.8, seconds * 0.12)
  const outro = Math.min(1.4, seconds * 0.18)
  master.gain.setValueAtTime(0, 0)
  master.gain.linearRampToValueAtTime(0.2, intro)
  master.gain.setValueAtTime(0.2, Math.max(intro, seconds - outro))
  master.gain.linearRampToValueAtTime(0, seconds)
  master.connect(context.destination)

  for (const [frequency, level] of [
    [174.61, 0.07],
    [220, 0.05],
    [261.63, 0.04],
    [329.63, 0.03],
  ] as const) {
    const osc = context.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = frequency
    const gain = context.createGain()
    gain.gain.value = level
    osc.connect(gain)
    gain.connect(master)
    osc.start(0)
    osc.stop(seconds)
  }

  const noise = context.createBuffer(1, Math.ceil(sampleRate * seconds), sampleRate)
  const data = noise.getChannelData(0)
  let hold = 0
  for (let index = 0; index < data.length; index += 1) {
    hold = hold * 0.985 + (Math.random() * 2 - 1) * 0.015
    data[index] = hold
  }
  const source = context.createBufferSource()
  source.buffer = noise
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 380
  const noiseGain = context.createGain()
  noiseGain.gain.value = 0.4
  source.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(master)
  source.start(0)
  return context.startRendering()
}
