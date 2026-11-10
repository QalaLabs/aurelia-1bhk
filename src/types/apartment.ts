export type RoomId =
  | 'living'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'balcony'
  | 'foyer'

export type FloorKind = 'wood' | 'kitchen' | 'bath' | 'stone'

export type ViewPreset = 'iso' | 'top' | 'interior'

export type NavTool = 'orbit' | 'pan' | 'zoom'

export type Vec3 = [number, number, number]

export type RoomDef = {
  id: RoomId
  name: string
  x0: number
  z0: number
  x1: number
  z1: number
  floor: FloorKind
  ceiling: boolean
  dimensions: string
  areaLabel: string
  area: number
  summary: string
  finishes: string[]
  furniture: string[]
}

export type OpeningKind = 'door' | 'entrance' | 'sliding' | 'window' | 'vent'

export type Opening = {
  id: string
  kind: OpeningKind
  at: number
  width: number
  height: number
  sill: number
  hinge?: 'min' | 'max'
  swing?: number
}

export type SkirtSide = 'both' | 'pos' | 'neg' | 'none'

export type WallDef = {
  id: string
  a: [number, number]
  b: [number, number]
  thickness: number
  height: number
  skirt: SkirtSide
  openings: Opening[]
}

export type Visibility = {
  walls: boolean
  ceiling: boolean
  furniture: boolean
  labels: boolean
}
