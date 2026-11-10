import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { useApartment } from '../../context/ApartmentContext.tsx'
import { canOccupy } from '../../systems/collision.ts'

const EYE = 5.45
const SPEED = 7.2

export function FirstPerson() {
  const { fpv } = useApartment()
  const { camera, gl } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const yaw = useRef(Math.PI)
  const pitch = useRef(-0.08)
  const eye = useRef(new Vector3(6.2, EYE, 3.2))

  useEffect(() => {
    if (!fpv) return
    eye.current.set(6.2, EYE, 3.2)
    yaw.current = Math.PI
    pitch.current = -0.08
    camera.position.copy(eye.current)
    const element = gl.domElement
    const onKey = (event: KeyboardEvent) => {
      keys.current[event.code] = event.type === 'keydown'
    }
    const onMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== element) return
      yaw.current -= event.movementX * 0.0022
      pitch.current = Math.max(-1.15, Math.min(1.15, pitch.current - event.movementY * 0.0022))
    }
    const onClick = () => {
      void element.requestPointerLock()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    document.addEventListener('mousemove', onMove)
    element.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
      document.removeEventListener('mousemove', onMove)
      element.removeEventListener('click', onClick)
      if (document.pointerLockElement === element) document.exitPointerLock()
    }
  }, [fpv, camera, gl])

  useFrame((_, delta) => {
    if (!fpv) return
    const step = Math.min(delta, 0.05) * SPEED
    const sin = Math.sin(yaw.current)
    const cos = Math.cos(yaw.current)
    let x = 0
    let z = 0
    if (keys.current.KeyW || keys.current.ArrowUp) {
      x -= sin
      z -= cos
    }
    if (keys.current.KeyS || keys.current.ArrowDown) {
      x += sin
      z += cos
    }
    if (keys.current.KeyA || keys.current.ArrowLeft) {
      x -= cos
      z += sin
    }
    if (keys.current.KeyD || keys.current.ArrowRight) {
      x += cos
      z -= sin
    }
    const length = Math.hypot(x, z)
    if (length > 0) {
      x = (x / length) * step
      z = (z / length) * step
      const nextX = eye.current.x + x
      const nextZ = eye.current.z + z
      if (canOccupy(nextX, nextZ)) {
        eye.current.x = nextX
        eye.current.z = nextZ
      } else if (canOccupy(nextX, eye.current.z)) {
        eye.current.x = nextX
      } else if (canOccupy(eye.current.x, nextZ)) {
        eye.current.z = nextZ
      }
    }
    eye.current.y = EYE
    camera.position.copy(eye.current)
    camera.rotation.order = 'YXZ'
    camera.rotation.y = yaw.current
    camera.rotation.x = pitch.current
  })

  return null
}
