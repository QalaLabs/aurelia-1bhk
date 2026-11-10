import { useMemo } from 'react'
import { WALLS } from '../../data/layout.ts'
import { mats } from '../../materials/library.ts'
import type { Opening, WallDef } from '../../types/apartment.ts'
import { useApartment } from '../../context/ApartmentContext.tsx'
import { Box } from './geometry.tsx'

type Piece = { cx: number; cy: number; sx: number; sy: number }

function sliceWall(length: number, height: number, openings: Opening[]): Piece[] {
  const sorted = [...openings].sort((a, b) => a.at - b.at)
  const pieces: Piece[] = []
  let cursor = 0
  for (const opening of sorted) {
    const left = Math.max(0, opening.at - opening.width / 2)
    const right = Math.min(length, opening.at + opening.width / 2)
    if (left > cursor + 0.01) {
      const sx = left - cursor
      pieces.push({ cx: cursor + sx / 2, cy: height / 2, sx, sy: height })
    }
    if (opening.sill > 0.02 && right > left) {
      pieces.push({
        cx: (left + right) / 2,
        cy: opening.sill / 2,
        sx: right - left,
        sy: opening.sill,
      })
    }
    const head = opening.sill + opening.height
    if (head < height - 0.02 && right > left) {
      const sy = height - head
      pieces.push({
        cx: (left + right) / 2,
        cy: head + sy / 2,
        sx: right - left,
        sy,
      })
    }
    cursor = Math.max(cursor, right)
  }
  if (cursor < length - 0.01) {
    const sx = length - cursor
    pieces.push({ cx: cursor + sx / 2, cy: height / 2, sx, sy: height })
  }
  return pieces
}

function skirtOffsets(side: WallDef['skirt']) {
  if (side === 'both') return [1, -1]
  if (side === 'pos') return [1]
  if (side === 'neg') return [-1]
  return []
}

function DoorLeaf({
  opening,
  thickness,
}: {
  opening: Opening
  thickness: number
}) {
  const leafW = opening.width - 0.16
  const leafH = opening.height - 0.08
  const hinge = opening.hinge === 'max' ? opening.at + opening.width / 2 : opening.at - opening.width / 2
  const dir = opening.hinge === 'max' ? -1 : 1
  const swing = opening.swing ?? 0.6
  const material = opening.kind === 'entrance' ? mats.teak : mats.paint
  return (
    <group position={[hinge, opening.sill, 0]} rotation={[0, dir * swing, 0]}>
      <Box
        size={[leafW, leafH, 0.12]}
        position={[dir * leafW * 0.5, leafH * 0.5, 0]}
        material={material}
        tile={3}
      />
      <Box
        size={[0.08, 0.5, 0.08]}
        position={[dir * (leafW - 0.18), 3.15, thickness * 0.5]}
        material={mats.brass}
        tile={1}
      />
      {opening.kind === 'entrance' && (
        <mesh position={[dir * leafW * 0.5, 4.7, 0.07]} material={mats.brass}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
        </mesh>
      )}
    </group>
  )
}

function WindowUnit({
  opening,
  thickness,
  interior,
}: {
  opening: Opening
  thickness: number
  interior: number
}) {
  const glassMat = opening.kind === 'vent' ? mats.frost : mats.glass
  const frame = 0.11
  const w = opening.width
  const h = opening.height
  const depth = thickness + 0.08
  return (
    <group position={[opening.at, opening.sill + h / 2, 0]}>
      <Box size={[frame, h, depth]} position={[-w / 2 + frame / 2, 0, 0]} material={mats.aluminum} tile={1} />
      <Box size={[frame, h, depth]} position={[w / 2 - frame / 2, 0, 0]} material={mats.aluminum} tile={1} />
      <Box size={[w, frame, depth]} position={[0, h / 2 - frame / 2, 0]} material={mats.aluminum} tile={1} />
      <Box size={[w - frame * 2, frame, depth]} position={[0, -h / 2 + frame / 2, 0]} material={mats.aluminum} tile={1} />
      <Box
        size={[w - frame * 2, h - frame * 2, 0.04]}
        material={glassMat}
        tile={2}
        shadow={false}
      />
      {opening.kind === 'window' && w > 3 && (
        <Box size={[0.06, h - frame * 2, 0.07]} material={mats.aluminum} tile={1} />
      )}
      <Box
        size={[w + 0.28, 0.09, 0.28]}
        position={[0, -h / 2 - 0.02, interior * (thickness / 2 + 0.04)]}
        material={mats.skirting}
        tile={2}
      />
    </group>
  )
}

function Slider({ opening, thickness }: { opening: Opening; thickness: number }) {
  const panelW = opening.width / 2 + 0.08
  const panelH = opening.height - 0.12
  return (
    <group position={[opening.at, opening.sill, 0]}>
      <Box
        size={[opening.width + 0.2, 0.12, thickness + 0.16]}
        position={[0, opening.height - 0.02, 0]}
        material={mats.aluminum}
        tile={2}
      />
      <Box
        size={[opening.width + 0.2, 0.08, 0.28]}
        position={[0, 0.04, 0]}
        material={mats.aluminum}
        tile={2}
      />
      {[
        { x: -opening.width * 0.22, z: -0.06 },
        { x: opening.width * 0.08, z: 0.08 },
      ].map((panel) => (
        <group key={panel.x} position={[panel.x, panelH / 2 + 0.06, panel.z]}>
          <Box size={[panelW, panelH, 0.08]} material={mats.aluminum} tile={2} />
          <Box
            size={[panelW - 0.16, panelH - 0.16, 0.03]}
            material={mats.glass}
            tile={2}
            shadow={false}
          />
        </group>
      ))}
    </group>
  )
}

function Wall({ wall }: { wall: WallDef }) {
  const dx = wall.b[0] - wall.a[0]
  const dz = wall.b[1] - wall.a[1]
  const length = Math.hypot(dx, dz)
  const angle = Math.atan2(dz, dx)
  const pieces = useMemo(
    () => sliceWall(length, wall.height, wall.openings),
    [length, wall.height, wall.openings],
  )
  const interior = wall.skirt === 'neg' ? -1 : 1

  return (
    <group position={[wall.a[0], 0, wall.a[1]]} rotation={[0, -angle, 0]}>
      {pieces.map((piece) => (
        <Box
          key={`${piece.cx}-${piece.cy}`}
          size={[piece.sx, piece.sy, wall.thickness]}
          position={[piece.cx, piece.cy, 0]}
          material={mats.plaster}
          tile={4}
        />
      ))}
      {pieces
        .filter((piece) => piece.cy - piece.sy / 2 < 0.05)
        .flatMap((piece) =>
          skirtOffsets(wall.skirt).map((side) => (
            <Box
              key={`sk-${piece.cx}-${side}`}
              size={[piece.sx, 0.38, 0.045]}
              position={[
                piece.cx,
                0.19,
                side * (wall.thickness / 2 + 0.02),
              ]}
              material={mats.skirting}
              tile={3}
              shadow={false}
            />
          )),
        )}
      {wall.openings.map((item) => {
        if (item.kind === 'window' || item.kind === 'vent') {
          return (
            <WindowUnit
              key={item.id}
              opening={item}
              thickness={wall.thickness}
              interior={interior}
            />
          )
        }
        if (item.kind === 'sliding') {
          return <Slider key={item.id} opening={item} thickness={wall.thickness} />
        }
        return (
          <group key={item.id}>
            <Box
              size={[0.14, item.height, wall.thickness + 0.1]}
              position={[item.at - item.width / 2, item.height / 2, 0]}
              material={mats.paint}
              tile={2}
            />
            <Box
              size={[0.14, item.height, wall.thickness + 0.1]}
              position={[item.at + item.width / 2, item.height / 2, 0]}
              material={mats.paint}
              tile={2}
            />
            <Box
              size={[item.width, 0.16, wall.thickness + 0.1]}
              position={[item.at, item.height + 0.08, 0]}
              material={mats.paint}
              tile={2}
            />
            <DoorLeaf opening={item} thickness={wall.thickness} />
          </group>
        )
      })}
    </group>
  )
}

export function Walls() {
  const { visibility } = useApartment()
  if (!visibility.walls) return null
  return (
    <group>
      {WALLS.map((item) => (
        <Wall key={item.id} wall={item} />
      ))}
    </group>
  )
}

export function Slab() {
  return (
    <mesh position={[13.2, -0.2, 8.9]} receiveShadow material={mats.concrete}>
      <boxGeometry args={[29.2, 0.4, 27.6]} />
    </mesh>
  )
}

export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[13, -0.42, 9]} receiveShadow material={mats.ground}>
      <circleGeometry args={[70, 48]} />
    </mesh>
  )
}
