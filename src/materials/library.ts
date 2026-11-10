import * as THREE from 'three'

type Maps = {
  map: THREE.Texture
  roughnessMap: THREE.Texture
  normalMap: THREE.Texture
}

function hash(ix: number, iy: number) {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function noise(x: number, y: number) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const fx = x - x0
  const fy = y - y0
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  const a = hash(x0, y0)
  const b = hash(x0 + 1, y0)
  const c = hash(x0, y0 + 1)
  const d = hash(x0 + 1, y0 + 1)
  return a * (1 - sx) * (1 - sy) + b * sx * (1 - sy) + c * (1 - sx) * sy + d * sx * sy
}

function fbm(x: number, y: number, octaves = 5) {
  let value = 0
  let amplitude = 0.5
  let frequency = 1
  let weight = 0
  for (let i = 0; i < octaves; i += 1) {
    value += amplitude * noise(x * frequency, y * frequency)
    weight += amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  return value / weight
}

function canvas(size: number) {
  const element = document.createElement('canvas')
  element.width = size
  element.height = size
  const ctx = element.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  return { element, ctx, image: ctx.createImageData(size, size) }
}

function texFrom(image: ImageData, ctx: CanvasRenderingContext2D, element: HTMLCanvasElement, color: boolean) {
  ctx.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(element)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function pack(
  size: number,
  sample: (x: number, y: number) => { r: number; g: number; b: number; rough: number; height: number },
  normalStrength: number,
): Maps {
  const color = canvas(size)
  const rough = canvas(size)
  const height = new Float32Array(size * size)
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const pixel = sample(x, y)
      const index = (y * size + x) * 4
      color.image.data[index] = pixel.r
      color.image.data[index + 1] = pixel.g
      color.image.data[index + 2] = pixel.b
      color.image.data[index + 3] = 255
      const roughness = Math.max(0, Math.min(255, pixel.rough))
      rough.image.data[index] = roughness
      rough.image.data[index + 1] = roughness
      rough.image.data[index + 2] = roughness
      rough.image.data[index + 3] = 255
      height[y * size + x] = pixel.height
    }
  }
  const normal = canvas(size)
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const left = height[y * size + ((x - 1 + size) % size)] ?? 0
      const right = height[y * size + ((x + 1) % size)] ?? 0
      const up = height[((y - 1 + size) % size) * size + x] ?? 0
      const down = height[((y + 1) % size) * size + x] ?? 0
      const dx = (right - left) * normalStrength
      const dy = (down - up) * normalStrength
      const length = Math.hypot(-dx, -dy, 1)
      const index = (y * size + x) * 4
      normal.image.data[index] = (-dx / length) * 127.5 + 127.5
      normal.image.data[index + 1] = (-dy / length) * 127.5 + 127.5
      normal.image.data[index + 2] = (1 / length) * 127.5 + 127.5
      normal.image.data[index + 3] = 255
    }
  }
  return {
    map: texFrom(color.image, color.ctx, color.element, true),
    roughnessMap: texFrom(rough.image, rough.ctx, rough.element, false),
    normalMap: texFrom(normal.image, normal.ctx, normal.element, false),
  }
}

function hex(value: string) {
  const raw = value.replace('#', '')
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16),
  }
}

function mix(base: number, amount: number) {
  return Math.max(0, Math.min(255, base + amount))
}

function wood(baseHex: string, boards: number) {
  const base = hex(baseHex)
  return pack(
    512,
    (x, y) => {
      const board = Math.floor((y / 512) * boards)
      const inBoard = (y / 512) * boards - board
      const seam = Math.min(inBoard, 1 - inBoard)
      const bevel = Math.min(1, seam * 18)
      const grain = fbm(x * 0.02 + board * 3.7, y * 0.004, 4)
      const pore = fbm(x * 0.15, y * 0.05 + board, 3)
      const knotCenter = board % 4 === 1 ? 0.72 : 1.4
      const knot = Math.hypot((x / 512 - knotCenter) * 2.2, inBoard - 0.5)
      const ring = Math.exp(-knot * 7) * (0.5 + 0.5 * Math.sin(knot * 46))
      const tone = (grain - 0.5) * 46 + (pore - 0.5) * 18 - ring * 28 + (hash(board, 2) - 0.5) * 16
      const height = bevel * 0.85 + grain * 0.35 + pore * 0.12 - ring * 0.45
      return {
        r: mix(base.r, tone),
        g: mix(base.g, tone * 0.82),
        b: mix(base.b, tone * 0.55),
        rough: 150 + (1 - bevel) * 50 + pore * 30,
        height,
      }
    },
    3.2,
  )
}

function plaster(baseHex: string) {
  const base = hex(baseHex)
  return pack(
    512,
    (x, y) => {
      const coarse = fbm(x * 0.012, y * 0.012, 4)
      const stipple = fbm(x * 0.08, y * 0.08, 3)
      const pit = fbm(x * 0.22, y * 0.19, 2)
      const tone = (coarse - 0.5) * 18 + (stipple - 0.5) * 14
      return {
        r: mix(base.r, tone),
        g: mix(base.g, tone),
        b: mix(base.b, tone * 0.9),
        rough: 175 + stipple * 55,
        height: coarse * 0.45 + stipple * 0.4 + (pit > 0.72 ? -0.35 : 0),
      }
    },
    2.4,
  )
}

function tile(baseHex: string, groutHex: string, cell: number) {
  const face = hex(baseHex)
  const grout = hex(groutHex)
  return pack(
    512,
    (x, y) => {
      const lx = x % cell
      const ly = y % cell
      const margin = 7
      const inside = lx > margin && ly > margin && lx < cell - margin && ly < cell - margin
      const edge = Math.min(lx, ly, cell - lx, cell - ly) / margin
      const speck = fbm(x * 0.05, y * 0.05, 3)
      const tone = (speck - 0.5) * 16
      if (!inside) {
        return {
          r: mix(grout.r, tone * 0.4),
          g: mix(grout.g, tone * 0.4),
          b: mix(grout.b, tone * 0.4),
          rough: 210,
          height: 0.05 + edge * 0.15,
        }
      }
      return {
        r: mix(face.r, tone),
        g: mix(face.g, tone),
        b: mix(face.b, tone),
        rough: 95 + speck * 40,
        height: 0.75 + speck * 0.2 + Math.min(edge, 1) * 0.15,
      }
    },
    4.5,
  )
}

function marble() {
  const base = hex('#efeae2')
  return pack(
    512,
    (x, y) => {
      const cloud = fbm(x * 0.01, y * 0.01, 5)
      const vein = Math.abs(Math.sin((x * 0.03 + fbm(x * 0.02, y * 0.02, 3) * 8) + y * 0.004))
      const dark = Math.exp(-vein * 6)
      const tone = (cloud - 0.5) * 12 - dark * 55
      return {
        r: mix(base.r, tone),
        g: mix(base.g, tone * 0.95),
        b: mix(base.b, tone * 0.85),
        rough: 55 + cloud * 30 + dark * 20,
        height: cloud * 0.15 - dark * 0.35,
      }
    },
    2.2,
  )
}

function fabric(baseHex: string) {
  const base = hex(baseHex)
  return pack(
    256,
    (x, y) => {
      const warp = 0.5 + 0.5 * Math.sin(x * 1.15)
      const weft = 0.5 + 0.5 * Math.sin(y * 1.15)
      const weave = warp * weft
      const fiber = fbm(x * 0.08, y * 0.08, 3)
      const tone = (weave - 0.35) * 28 + (fiber - 0.5) * 16
      return {
        r: mix(base.r, tone),
        g: mix(base.g, tone),
        b: mix(base.b, tone * 0.9),
        rough: 190 + (1 - weave) * 40,
        height: weave * 0.7 + fiber * 0.25,
      }
    },
    2.8,
  )
}

function rug() {
  const base = hex('#c4aa86')
  return pack(
    512,
    (x, y) => {
      const border = x < 36 || y < 36 || x > 476 || y > 476
      const inner = x < 54 || y < 54 || x > 458 || y > 458
      const pile = fbm(x * 0.09, y * 0.09, 3)
      const row = Math.sin(y * 0.45) * 0.5
      let color = base
      if (border) color = hex('#6e5338')
      else if (inner) color = hex('#e7d7be')
      const tone = (pile - 0.5) * 20 + row * 8
      return {
        r: mix(color.r, tone),
        g: mix(color.g, tone),
        b: mix(color.b, tone * 0.8),
        rough: 220,
        height: 0.4 + pile * 0.6 + (border ? -0.2 : 0),
      }
    },
    2.5,
  )
}

function concrete(baseHex: string) {
  const base = hex(baseHex)
  return pack(
    256,
    (x, y) => {
      const n = fbm(x * 0.03, y * 0.03, 4)
      const pit = fbm(x * 0.12, y * 0.12, 2)
      const tone = (n - 0.5) * 22
      return {
        r: mix(base.r, tone),
        g: mix(base.g, tone),
        b: mix(base.b, tone),
        rough: 200 + pit * 40,
        height: n * 0.5 + (pit > 0.78 ? -0.4 : 0),
      }
    },
    2,
  )
}

function foliage(baseHex: string) {
  const base = hex(baseHex)
  return pack(
    256,
    (x, y) => {
      const blot = fbm(x * 0.03, y * 0.03, 4)
      const vein = Math.abs(Math.sin(x * 0.08 + blot * 4))
      const tone = (blot - 0.5) * 40 - (1 - vein) * 18
      return {
        r: mix(base.r, tone * 0.45),
        g: mix(base.g, tone),
        b: mix(base.b, tone * 0.35),
        rough: 160,
        height: blot * 0.8 + vein * 0.2,
      }
    },
    2.2,
  )
}

function keep<T extends THREE.Material>(material: T) {
  material.dispose = () => {}
  return material
}

function surface(maps: Maps, color: string, roughness: number, normal = 1, env = 0.4, metalness = 0) {
  const material = new THREE.MeshStandardMaterial({
    color,
    map: maps.map,
    roughness,
    roughnessMap: maps.roughnessMap,
    normalMap: maps.normalMap,
    metalness,
    envMapIntensity: env,
  })
  material.normalScale.set(normal, normal)
  return keep(material)
}

const oakFloorMaps = wood('#b58155', 7)
const oakMaps = wood('#c49a68', 5)
const oakDarkMaps = wood('#7a4e2c', 4)
const oakLightMaps = wood('#e4d0b0', 6)
const plasterMaps = plaster('#f3eee4')
const paintMaps = plaster('#f7f4ee')
const kitchenMaps = tile('#e5ddd0', '#b7ad9e', 128)
const bathMaps = tile('#f4f1ea', '#d2cbc0', 160)
const bathFloorMaps = tile('#cfc6b8', '#a79d90', 96)
const stoneMaps = tile('#c9bba8', '#a89884', 170)
const marbleMaps = marble()
const fabricMaps = fabric('#e2d0ba')
const fabricDeepMaps = fabric('#c9b59a')
const linenMaps = fabric('#f4efe6')
const accentMaps = fabric('#c6a36a')
const rugMaps = rug()
const concreteMaps = concrete('#c9c0b4')
const groundMaps = concrete('#d7d0c4')
const leafMaps = foliage('#3d6b48')
const leafDarkMaps = foliage('#2a4e34')
const clayMaps = concrete('#a45e40')

const screenCanvas = document.createElement('canvas')
screenCanvas.width = 512
screenCanvas.height = 288
const screenCtx = screenCanvas.getContext('2d')
if (!screenCtx) throw new Error('Canvas unavailable')
const glow = screenCtx.createRadialGradient(160, 120, 10, 220, 140, 280)
glow.addColorStop(0, '#8ea4b4')
glow.addColorStop(0.4, '#31414c')
glow.addColorStop(1, '#101418')
screenCtx.fillStyle = glow
screenCtx.fillRect(0, 0, 512, 288)
screenCtx.fillStyle = 'rgba(232, 196, 148, 0.4)'
screenCtx.fillRect(300, 64, 96, 130)
const screenMap = new THREE.CanvasTexture(screenCanvas)
screenMap.colorSpace = THREE.SRGBColorSpace
screenMap.needsUpdate = true

export const mats = {
  plaster: surface(plasterMaps, '#ffffff', 0.92, 0.85, 0.28),
  skirting: surface(paintMaps, '#ffffff', 0.72, 0.4, 0.22),
  woodFloor: surface(oakFloorMaps, '#ffffff', 0.55, 1.15, 0.4),
  oak: surface(oakMaps, '#ffffff', 0.5, 1.05, 0.38),
  oakDark: surface(oakDarkMaps, '#ffffff', 0.48, 1, 0.36),
  oakLight: surface(oakLightMaps, '#ffffff', 0.52, 0.9, 0.32),
  fabric: surface(fabricMaps, '#ffffff', 0.86, 0.85, 0.15),
  fabricDeep: surface(fabricDeepMaps, '#ffffff', 0.9, 0.8, 0.14),
  linen: surface(linenMaps, '#ffffff', 0.84, 0.7, 0.14),
  accent: surface(accentMaps, '#ffffff', 0.78, 0.6, 0.16),
  marble: surface(marbleMaps, '#ffffff', 0.28, 0.55, 0.7, 0.04),
  kitchenTile: surface(kitchenMaps, '#ffffff', 0.42, 1.2, 0.4, 0.02),
  bathTile: surface(bathMaps, '#ffffff', 0.36, 1.15, 0.42, 0.03),
  bathFloor: surface(bathFloorMaps, '#ffffff', 0.4, 1.25, 0.38, 0.03),
  stone: surface(stoneMaps, '#ffffff', 0.62, 1.1, 0.3, 0.02),
  ceramic: surface(paintMaps, '#ffffff', 0.22, 0.25, 0.55, 0.02),
  paint: surface(paintMaps, '#ffffff', 0.4, 0.35, 0.28, 0.02),
  teak: surface(oakDarkMaps, '#ffffff', 0.42, 1, 0.4),
  metal: keep(
    new THREE.MeshStandardMaterial({
      color: '#d5d6d2',
      roughness: 0.28,
      metalness: 0.88,
      roughnessMap: concreteMaps.roughnessMap,
      envMapIntensity: 1,
    }),
  ),
  metalDark: keep(
    new THREE.MeshStandardMaterial({
      color: '#3a3b3e',
      roughness: 0.4,
      metalness: 0.8,
      roughnessMap: concreteMaps.roughnessMap,
      envMapIntensity: 0.9,
    }),
  ),
  aluminum: keep(
    new THREE.MeshStandardMaterial({
      color: '#c5c8cc',
      roughness: 0.32,
      metalness: 0.74,
      envMapIntensity: 0.95,
    }),
  ),
  brass: keep(
    new THREE.MeshStandardMaterial({
      color: '#b08d57',
      roughness: 0.32,
      metalness: 0.84,
      envMapIntensity: 1,
    }),
  ),
  plant: surface(leafMaps, '#ffffff', 0.78, 0.7, 0.2),
  plantDark: surface(leafDarkMaps, '#ffffff', 0.8, 0.65, 0.18),
  terracotta: surface(clayMaps, '#ffffff', 0.7, 0.8, 0.25),
  curtain: surface(linenMaps, '#ffffff', 0.9, 0.55, 0.12),
  sheer: surface(linenMaps, '#f7f4ee', 0.45, 0.2, 0.2),
  concrete: surface(concreteMaps, '#ffffff', 0.92, 0.6, 0.12),
  ground: surface(groundMaps, '#ffffff', 1, 0.3, 0.05),
  lampShade: keep(
    new THREE.MeshStandardMaterial({
      color: '#fff6e8',
      emissive: '#ffd9a8',
      emissiveIntensity: 0.85,
      roughness: 0.6,
      map: linenMaps.map,
    }),
  ),
  bulb: keep(
    new THREE.MeshStandardMaterial({
      color: '#fff4df',
      emissive: '#ffe2b0',
      emissiveIntensity: 2.4,
      roughness: 0.4,
    }),
  ),
  screen: keep(
    new THREE.MeshStandardMaterial({
      color: '#9eb0bc',
      map: screenMap,
      emissive: '#6f8ea0',
      emissiveMap: screenMap,
      emissiveIntensity: 0.55,
      roughness: 0.18,
      metalness: 0.1,
    }),
  ),
  rug: surface(rugMaps, '#ffffff', 0.96, 0.9, 0.08),
  highlight: keep(
    new THREE.MeshBasicMaterial({
      color: '#c6a36a',
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    }),
  ),
  glass: keep(
    new THREE.MeshPhysicalMaterial({
      color: '#e7eef0',
      roughness: 0.04,
      metalness: 0,
      transmission: 0.9,
      thickness: 0.08,
      ior: 1.5,
      transparent: true,
      envMapIntensity: 1.15,
    }),
  ),
  showerGlass: keep(
    new THREE.MeshPhysicalMaterial({
      color: '#e4f1ef',
      roughness: 0.08,
      metalness: 0,
      transmission: 0.72,
      thickness: 0.08,
      transparent: true,
      envMapIntensity: 1,
    }),
  ),
  frost: keep(
    new THREE.MeshPhysicalMaterial({
      color: '#f4f7f6',
      roughness: 0.42,
      metalness: 0,
      transmission: 0.55,
      thickness: 0.06,
      transparent: true,
      envMapIntensity: 0.6,
    }),
  ),
}

mats.sheer.transparent = true
mats.sheer.opacity = 0.38
mats.sheer.depthWrite = false
mats.glass.side = THREE.DoubleSide
mats.showerGlass.side = THREE.DoubleSide
mats.frost.side = THREE.DoubleSide
