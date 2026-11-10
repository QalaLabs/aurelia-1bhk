import { Environment, Grid } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Component, Suspense, useLayoutEffect, useRef, type ReactNode } from 'react'
import { Object3D, type DirectionalLight } from 'three'

class QuietBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

function ShadowBake() {
  const gl = useThree((state) => state.gl)
  const frames = useRef(0)
  useFrame(() => {
    frames.current += 1
    if (frames.current <= 12) gl.shadowMap.needsUpdate = true
  })
  return null
}

function Sun() {
  const light = useRef<DirectionalLight>(null)
  const target = useRef<Object3D>(null)
  useLayoutEffect(() => {
    if (light.current && target.current) light.current.target = target.current
  }, [])
  return (
    <>
      <object3D ref={target} position={[13, 0, 10]} />
      <directionalLight
        ref={light}
        position={[6, 34, -12]}
        intensity={3.2}
        color="#fff4e4"
        castShadow
        shadow-mapSize-width={3072}
        shadow-mapSize-height={3072}
        shadow-camera-near={2}
        shadow-camera-far={80}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
    </>
  )
}

export function Lighting() {
  return (
    <>
      <color attach="background" args={['#e4ddd2']} />
      <hemisphereLight args={['#fff6ea', '#c9b59a', 0.55]} />
      <ambientLight intensity={0.18} color="#fff4ea" />
      <Sun />
      <directionalLight position={[-16, 12, 18]} intensity={0.45} color="#d7e4f2" />
      <Grid
        position={[13, -0.4, 9]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#c9c0b3"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#a89884"
        fadeDistance={48}
        fadeStrength={1.4}
        infiniteGrid={false}
      />
      <QuietBoundary>
        <Suspense fallback={null}>
          <Environment preset="apartment" environmentIntensity={0.85} />
        </Suspense>
      </QuietBoundary>
      <ShadowBake />
    </>
  )
}
