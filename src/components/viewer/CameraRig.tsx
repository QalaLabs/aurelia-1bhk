import { CameraControls, CameraControlsImpl } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { SHOTS } from '../../data/layout.ts'
import { useApartment } from '../../context/ApartmentContext.tsx'
import { useStudio } from '../../studio/StudioContext.tsx'

function motionOff() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function CameraRig() {
  const ref = useRef<CameraControlsImpl>(null)
  const { tool, view, fpv, frame, framedRoom } = useApartment()
  const driving = useStudio((state) => state.driving)

  useEffect(() => {
    const controls = ref.current
    if (!controls) return
    const action = CameraControlsImpl.ACTION
    if (tool === 'orbit') {
      controls.mouseButtons.left = action.ROTATE
      controls.mouseButtons.right = action.TRUCK
      controls.mouseButtons.wheel = action.DOLLY
    } else if (tool === 'pan') {
      controls.mouseButtons.left = action.TRUCK
      controls.mouseButtons.right = action.ROTATE
      controls.mouseButtons.wheel = action.DOLLY
    } else {
      controls.mouseButtons.left = action.DOLLY
      controls.mouseButtons.right = action.TRUCK
      controls.mouseButtons.wheel = action.DOLLY
    }
    controls.touches.one = tool === 'pan' ? action.TOUCH_TRUCK : action.TOUCH_ROTATE
  }, [tool])

  useEffect(() => {
    const controls = ref.current
    if (!controls || fpv || driving) return
    const shot = framedRoom ? SHOTS[framedRoom] : SHOTS[view]
    void controls.setLookAt(
      shot.position[0],
      shot.position[1],
      shot.position[2],
      shot.target[0],
      shot.target[1],
      shot.target[2],
      !motionOff(),
    )
  }, [view, fpv, frame, framedRoom, driving])

  return (
    <CameraControls
      ref={ref}
      makeDefault
      enabled={!fpv && !driving}
      smoothTime={motionOff() ? 0 : 0.45}
      dollyToCursor
      minDistance={2}
      maxDistance={78}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2.05}
    />
  )
}
