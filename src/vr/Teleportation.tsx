import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import {
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Raycaster,
  RingGeometry,
  Vector3,
  type WebGLRenderer,
} from 'three'
import { ROOMS } from '../data/layout.ts'
import { useStudio } from '../studio/StudioContext.tsx'
import { canOccupy } from '../systems/collision.ts'

export const METERS_PER_FOOT = 0.3048
export const FEET_PER_METER = 1 / METERS_PER_FOOT

export const TELEPORT_POINTS: Record<string, [number, number]> = {
  foyer: [14.2, 17.6],
  living: [9.8, 6.2],
  bedroom: [23.6, 7.2],
  kitchen: [5, 17.4],
  bathroom: [22.7, 17.4],
  balcony: [7.5, -1.35],
}

const SPAWN: [number, number] = TELEPORT_POINTS.living
const UP = new Vector3(0, 1, 0)

type Rig = {
  controllers: Array<ReturnType<WebGLRenderer['xr']['getController']>>
  marker: Mesh
  aiming: boolean
  pending: [number, number] | null
  gamepads: Array<Gamepad | null>
}

const space: { base: XRReferenceSpace | null; feet: [number, number] } = {
  base: null,
  feet: SPAWN,
}

export function teleportFeet(gl: WebGLRenderer, x: number, z: number) {
  if (!space.base || !canOccupy(x, z)) return false
  const transform = new XRRigidTransform({
    x: -x * METERS_PER_FOOT,
    y: 0,
    z: -z * METERS_PER_FOOT,
    w: 1,
  })
  gl.xr.setReferenceSpace(space.base.getOffsetReferenceSpace(transform))
  space.feet = [x, z]
  return true
}

function menuTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 640
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not draw the VR room menu')
  context.fillStyle = '#171b20'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.strokeStyle = '#c6a36a'
  context.lineWidth = 8
  context.strokeRect(8, 8, canvas.width - 16, canvas.height - 16)
  context.fillStyle = '#f0d7ae'
  context.font = '600 42px sans-serif'
  context.fillText('Teleport', 36, 72)
  ROOMS.forEach((room, index) => {
    const y = 110 + index * 84
    context.fillStyle = '#2a241c'
    context.fillRect(28, y, canvas.width - 56, 68)
    context.fillStyle = '#f6f1e8'
    context.font = '500 34px sans-serif'
    context.fillText(room.name, 52, y + 46)
  })
  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function Teleportation() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const presenting = useStudio((state) => state.xrPresenting)
  const rig = useRef<Rig | null>(null)
  const origin = useRef(new Vector3())
  const direction = useRef(new Vector3())
  const forward = useRef(new Vector3())
  const strafe = useRef(new Vector3())
  const raycaster = useRef(new Raycaster())

  useEffect(() => {
    if (!presenting) return
    const controllers = [gl.xr.getController(0), gl.xr.getController(1)]
    const gamepads: Array<Gamepad | null> = [null, null]
    controllers.forEach((controller, index) => {
      scene.add(controller)
      const onConnected = (event: { data?: XRInputSource }) => {
        gamepads[index] = event.data?.gamepad ?? null
      }
      controller.addEventListener('connected', onConnected)
    })
    const ray = new Line(
      new BufferGeometry().setFromPoints([new Vector3(0, 0, 0), new Vector3(0, 0, -1)]),
      new LineBasicMaterial({ color: '#e2c48a' }),
    )
    ray.scale.z = 5
    ray.name = 'vr-ray'
    controllers[0].add(ray)
    const marker = new Mesh(
      new RingGeometry(0.12, 0.2, 32),
      new MeshBasicMaterial({ color: '#e2c48a', side: DoubleSide }),
    )
    marker.rotation.x = -Math.PI / 2
    marker.visible = false
    marker.name = 'vr-marker'
    scene.add(marker)
    const menuMaterial = new MeshBasicMaterial({ map: menuTexture(), transparent: true })
    const menu = new Mesh(new PlaneGeometry(0.42, 0.52), menuMaterial)
    menu.name = 'teleport-menu'
    menu.position.set(0, 0.05, -0.08)
    menu.rotation.x = -0.9
    controllers[1].add(menu)

    const local: Rig = { controllers, marker, aiming: false, pending: null, gamepads }
    const onStart = () => {
      local.aiming = true
    }
    const onEnd = () => {
      local.aiming = false
      local.marker.visible = false
      if (local.pending) teleportFeet(gl, local.pending[0], local.pending[1])
      local.pending = null
    }
    controllers[0].addEventListener('selectstart', onStart)
    controllers[0].addEventListener('selectend', onEnd)
    rig.current = local

    let frames = 0
    let stop = false
    const grabSpace = () => {
      if (stop) return
      const base = gl.xr.getReferenceSpace()
      if (base) {
        space.base = base
        teleportFeet(gl, SPAWN[0], SPAWN[1])
        return
      }
      frames += 1
      if (frames < 40) requestAnimationFrame(grabSpace)
    }
    grabSpace()

    return () => {
      stop = true
      controllers[0].removeEventListener('selectstart', onStart)
      controllers[0].removeEventListener('selectend', onEnd)
      controllers.forEach((controller) => scene.remove(controller))
      scene.remove(marker)
      ray.geometry.dispose()
      ;(ray.material as LineBasicMaterial).dispose()
      marker.geometry.dispose()
      ;(marker.material as MeshBasicMaterial).dispose()
      menu.geometry.dispose()
      menuMaterial.map?.dispose()
      menuMaterial.dispose()
      space.base = null
      rig.current = null
    }
  }, [gl, presenting, scene])

  useFrame((_, delta) => {
    const current = rig.current
    if (!current) return
    const step = Math.min(delta, 0.05)
    const pad = current.gamepads.find((item) => item && item.axes.length >= 4)
    if (pad) {
      const axisX = pad.axes[2] ?? 0
      const axisY = pad.axes[3] ?? 0
      if (Math.hypot(axisX, axisY) > 0.18) {
        const cam = gl.xr.getCamera()
        cam.getWorldDirection(forward.current)
        forward.current.y = 0
        if (forward.current.lengthSq() > 1e-6) {
          forward.current.normalize()
          strafe.current.crossVectors(forward.current, UP).normalize()
          const speed = 1.35 * step
          const moveX = (forward.current.x * -axisY + strafe.current.x * axisX) * speed
          const moveZ = (forward.current.z * -axisY + strafe.current.z * axisX) * speed
          const nextX = space.feet[0] + moveX * FEET_PER_METER
          const nextZ = space.feet[1] + moveZ * FEET_PER_METER
          if (!teleportFeet(gl, nextX, nextZ)) {
            if (!teleportFeet(gl, nextX, space.feet[1])) teleportFeet(gl, space.feet[0], nextZ)
          }
        }
      }
    }

    if (!current.aiming) {
      current.marker.visible = false
      current.pending = null
      return
    }
    const controller = current.controllers[0]
    controller.getWorldPosition(origin.current)
    controller.getWorldDirection(direction.current).multiplyScalar(-1)
    raycaster.current.set(origin.current, direction.current)
    raycaster.current.far = 12
    raycaster.current.layers.enableAll()
    const hits = raycaster.current.intersectObjects(scene.children, true)
    current.pending = null
    current.marker.visible = false
    for (const hit of hits) {
      const name = hit.object.name
      if (name === 'vr-ray' || name === 'vr-marker') continue
      if (name === 'teleport-menu' && hit.uv) {
        const index = Math.min(ROOMS.length - 1, Math.max(0, Math.floor((1 - hit.uv.y) * ROOMS.length)))
        const room = ROOMS[index]
        current.pending = TELEPORT_POINTS[room.id] ?? SPAWN
        return
      }
      if (name === 'walk-floor' || name === 'floor-highlight') {
        const feetX = hit.point.x * FEET_PER_METER
        const feetZ = hit.point.z * FEET_PER_METER
        if (!canOccupy(feetX, feetZ)) return
        current.pending = [feetX, feetZ]
        current.marker.visible = true
        current.marker.position.copy(hit.point)
        current.marker.position.y += 0.03
        return
      }
      return
    }
  })

  return null
}
