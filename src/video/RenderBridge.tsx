import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import type { Pose } from '../cinematics/CameraPaths.ts'
import { useStudio } from '../studio/StudioContext.tsx'
import { studioBridge, type StudioBridge } from './bridge.ts'
import { CubemapRenderer, faceSizeFor } from './CubemapRenderer.ts'
import { PanoramaRenderer } from './PanoramaRenderer.ts'
import { copyDrawingBuffer, pixelsToJpeg } from './pixels.ts'

function applyPose(camera: PerspectiveCamera, pose: Pose, target: Vector3) {
  camera.position.set(pose.position[0], pose.position[1], pose.position[2])
  target.set(pose.target[0], pose.target[1], pose.target[2])
  camera.lookAt(target)
  camera.fov = pose.fov
  camera.updateProjectionMatrix()
}

export function RenderBridge() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera) as PerspectiveCamera
  const advance = useThree((state) => state.advance)
  const setSize = useThree((state) => state.setSize)
  const setDpr = useThree((state) => state.setDpr)
  const setFrameloop = useThree((state) => state.setFrameloop)
  const setMaxTexture = useStudio((state) => state.setMaxTexture)
  const sizeRef = useRef({ width: 1, height: 1, dpr: 1 })
  const size = useThree((state) => state.size)
  const dpr = useThree((state) => state.viewport.dpr)

  useEffect(() => {
    sizeRef.current = { width: size.width, height: size.height, dpr }
  }, [dpr, size.height, size.width])

  useEffect(() => {
    setMaxTexture(gl.capabilities.maxTextureSize)
    const cubemap = new CubemapRenderer()
    const panorama = new PanoramaRenderer()
    const look = new Vector3()
    let prepared = false
    let saved = { width: 1, height: 1, dpr: 1 }

    const bridge: StudioBridge = {
      maxTexture: gl.capabilities.maxTextureSize,
      prepare() {
        saved = { ...sizeRef.current }
        prepared = true
        setFrameloop('never')
      },
      restore() {
        if (!prepared) return
        prepared = false
        setDpr(saved.dpr)
        setSize(saved.width, saved.height)
        gl.domElement.style.width = '100%'
        gl.domElement.style.height = '100%'
        setFrameloop('always')
      },
      async captureFrame(pose, width, height, fade, seconds) {
        applyPose(camera, pose, look)
        setDpr(1)
        setSize(width, height)
        gl.domElement.style.width = '100%'
        gl.domElement.style.height = '100%'
        gl.shadowMap.needsUpdate = true
        advance(seconds * 1000, true)
        return copyDrawingBuffer(gl.domElement, fade)
      },
      async captureEquirect(position, width, height, fade) {
        camera.position.set(position[0], position[1], position[2])
        gl.shadowMap.needsUpdate = true
        const face = faceSizeFor(width, gl.capabilities.maxTextureSize)
        const target = cubemap.ensure(face).render(gl, scene, position)
        const pixels = panorama.project(gl, target.texture, width, height)
        return pixelsToJpeg(pixels, width, height, fade)
      },
    }
    studioBridge.current = bridge
    return () => {
      bridge.restore()
      cubemap.dispose()
      panorama.dispose()
      if (studioBridge.current === bridge) studioBridge.current = null
    }
  }, [advance, camera, gl, scene, setDpr, setFrameloop, setMaxTexture, setSize])

  return null
}
