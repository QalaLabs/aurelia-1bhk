import type { CameraControlsImpl } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import { useStudio } from '../studio/StudioContext.tsx'
import { samplePath } from './CameraPaths.ts'

function applyPose(camera: PerspectiveCamera, path: ReturnType<typeof samplePath>, target: Vector3) {
  camera.position.set(path.position[0], path.position[1], path.position[2])
  target.set(path.target[0], path.target[1], path.target[2])
  camera.lookAt(target)
  if (Math.abs(camera.fov - path.fov) > 0.01) {
    camera.fov = path.fov
    camera.updateProjectionMatrix()
  }
}

export function CameraDirector() {
  const camera = useThree((state) => state.camera) as PerspectiveCamera
  const controls = useThree((state) => state.controls) as CameraControlsImpl | null
  const preview = useStudio((state) => state.previewPlaying)
  const rendering = useStudio((state) => state.rendering)
  const path = useStudio((state) => state.settings.path)
  const duration = useStudio((state) => state.settings.duration)
  const seekSerial = useStudio((state) => state.seekSerial)
  const timeRef = useStudio((state) => state.timeRef)
  const publishTime = useStudio((state) => state.publishTime)
  const stopPreview = useStudio((state) => state.stopPreview)
  const target = useRef(new Vector3())
  const wasDriving = useRef(false)
  const lastPublish = useRef(0)

  useEffect(() => {
    if (seekSerial === 0 || preview || rendering) return
    const seconds = timeRef.current
    applyPose(camera, samplePath(path, duration === 0 ? 0 : seconds / duration), target.current)
  }, [camera, duration, path, preview, rendering, seekSerial, timeRef])

  useFrame((_, delta) => {
    const driving = preview || rendering
    if (wasDriving.current && !driving && controls) {
      void controls.setLookAt(
        camera.position.x,
        camera.position.y,
        camera.position.z,
        target.current.x,
        target.current.y,
        target.current.z,
        false,
      )
    }
    wasDriving.current = driving
    if (!preview || rendering) return
    timeRef.current = Math.min(duration, timeRef.current + Math.min(delta, 0.05))
    applyPose(camera, samplePath(path, duration === 0 ? 0 : timeRef.current / duration), target.current)
    const now = performance.now()
    if (now - lastPublish.current > 160) {
      lastPublish.current = now
      publishTime(timeRef.current)
    }
    if (timeRef.current >= duration - 1e-3) stopPreview()
  })

  return null
}
