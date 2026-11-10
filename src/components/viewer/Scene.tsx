import { Canvas, useThree } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from 'three'
import { Architecture } from '../apartment/Architecture.tsx'
import { useApartment } from '../../context/ApartmentContext.tsx'
import { CameraDirector } from '../../cinematics/CameraDirector.tsx'
import { Grade } from '../../rendering/PostProcessing.tsx'
import { RenderBridge } from '../../video/RenderBridge.tsx'
import { Teleportation } from '../../vr/Teleportation.tsx'
import { VRNavigation } from '../../vr/VRNavigation.tsx'
import { WebXRManager } from '../../vr/WebXRManager.tsx'
import { CameraRig } from './CameraRig.tsx'
import { FirstPerson } from './FirstPerson.tsx'
import { Lighting } from './Lighting.tsx'
import { RoomLabels } from './markers.tsx'

function PickLayer() {
  const raycaster = useThree((state) => state.raycaster)
  useLayoutEffect(() => {
    raycaster.layers.set(1)
  }, [raycaster])
  return null
}

export function Scene() {
  const { fpv } = useApartment()

  return (
    <Canvas
      className={fpv ? 'cursor-none' : undefined}
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [46, 32, 42], fov: 38, near: 0.1, far: 220 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
        outputColorSpace: SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFSoftShadowMap
        gl.shadowMap.autoUpdate = false
        gl.shadowMap.needsUpdate = true
      }}
    >
      <PickLayer />
      <VRNavigation>
        <Lighting />
        <Architecture />
        <RoomLabels />
      </VRNavigation>
      <CameraRig />
      <FirstPerson />
      <CameraDirector />
      <WebXRManager />
      <Teleportation />
      <RenderBridge />
      <Grade />
    </Canvas>
  )
}
