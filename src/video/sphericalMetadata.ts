const SPHERICAL_XML = [
  '<?xml version="1.0"?>',
  '<rdf:SphericalVideo xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:GSpherical="http://ns.google.com/videos/1.0/spherical/">',
  '<GSpherical:Spherical>true</GSpherical:Spherical>',
  '<GSpherical:Stitched>true</GSpherical:Stitched>',
  '<GSpherical:StitchingSoftware>Aurelia Studio</GSpherical:StitchingSoftware>',
  '<GSpherical:ProjectionType>equirectangular</GSpherical:ProjectionType>',
  '<GSpherical:StereoMode>mono</GSpherical:StereoMode>',
  '</rdf:SphericalVideo>',
].join('')

const UUID_BYTES = [
  0xff, 0xcc, 0x82, 0x63, 0xf8, 0x55, 0x4a, 0x93, 0x88, 0x14, 0x58, 0x7a, 0x02, 0x55, 0x2d, 0xc7,
]

const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'udta', 'mvex'])

function typeAt(bytes: Uint8Array, offset: number) {
  return String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7])
}

function boxSize(view: DataView, offset: number) {
  const size = view.getUint32(offset)
  if (size === 1) return { size: Number(view.getBigUint64(offset + 8)), header: 16 }
  if (size === 0) return { size: view.byteLength - offset, header: 8 }
  return { size, header: 8 }
}

function findTop(bytes: Uint8Array, name: string) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 0
  while (offset + 8 <= bytes.length) {
    const box = boxSize(view, offset)
    if (box.size < box.header || offset + box.size > bytes.length) return null
    if (typeAt(bytes, offset) === name) return { offset, size: box.size, header: box.header }
    offset += box.size
  }
  return null
}

function patchOffsets(view: DataView, start: number, end: number, moovEnd: number, delta: number) {
  let offset = start
  while (offset + 8 <= end) {
    const box = boxSize(view, offset)
    if (box.size < box.header || offset + box.size > end) return
    const name = typeAt(new Uint8Array(view.buffer, view.byteOffset, view.byteLength), offset)
    const payload = offset + box.header
    const boxEnd = offset + box.size
    if (name === 'stco') {
      const count = view.getUint32(payload + 4)
      for (let index = 0; index < count; index += 1) {
        const at = payload + 8 + index * 4
        const value = view.getUint32(at)
        if (value >= moovEnd) view.setUint32(at, value + delta)
      }
    } else if (name === 'co64') {
      const count = view.getUint32(payload + 4)
      for (let index = 0; index < count; index += 1) {
        const at = payload + 8 + index * 8
        const value = view.getBigUint64(at)
        if (value >= BigInt(moovEnd)) view.setBigUint64(at, value + BigInt(delta))
      }
    } else if (CONTAINERS.has(name)) {
      patchOffsets(view, payload, boxEnd, moovEnd, delta)
    }
    offset = boxEnd
  }
}

/** Inject the Google spherical uuid atom so players treat the file as equirectangular. */
export function injectSpherical(input: Uint8Array) {
  const moov = findTop(input, 'moov')
  if (!moov || moov.header !== 8) return input
  const xml = new TextEncoder().encode(SPHERICAL_XML)
  const uuidSize = 8 + UUID_BYTES.length + xml.length
  const next = new Uint8Array(input.length + uuidSize)
  const moovEnd = moov.offset + moov.size
  next.set(input.subarray(0, moovEnd), 0)
  const view = new DataView(next.buffer)
  view.setUint32(moov.offset, moov.size + uuidSize)
  const uuidAt = moovEnd
  view.setUint32(uuidAt, uuidSize)
  next.set([0x75, 0x75, 0x69, 0x64], uuidAt + 4)
  next.set(UUID_BYTES, uuidAt + 8)
  next.set(xml, uuidAt + 8 + UUID_BYTES.length)
  next.set(input.subarray(moovEnd), uuidAt + uuidSize)
  patchOffsets(view, moov.offset + 8, moovEnd, moovEnd, uuidSize)
  return next
}
