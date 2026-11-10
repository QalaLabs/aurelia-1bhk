import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import type { WebGLRenderer } from 'three'
import { useStudio } from '../studio/StudioContext.tsx'

export const vrActions: {
  enter: (() => Promise<void>) | null
  exit: (() => Promise<void>) | null
} = { enter: null, exit: null }

async function requestImmersive(gl: WebGLRenderer) {
  const xr = navigator.xr
  if (!xr) throw new Error('WebXR is not available. Use Walk on desktop, or open the HTTPS dev server on a Quest.')
  const session = await xr.requestSession('immersive-vr', {
    optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
  })
  await gl.xr.setSession(session)
}

export function WebXRManager() {
  const gl = useThree((state) => state.gl)
  const setSupported = useStudio((state) => state.setXrSupported)
  const setPresenting = useStudio((state) => state.setXrPresenting)
  const setView = useStudio((state) => state.restoreAfterVr)

  useEffect(() => {
    let cancelled = false
    const sessionXr = navigator.xr
    if (!sessionXr) setSupported(false)
    else {
      sessionXr
        .isSessionSupported('immersive-vr')
        .then((supported) => {
          if (!cancelled) setSupported(supported)
        })
        .catch(() => {
          if (!cancelled) setSupported(false)
        })
    }

    const onStart = () => setPresenting(true)
    const onEnd = () => {
      setPresenting(false)
      setView()
    }
    gl.xr.addEventListener('sessionstart', onStart)
    gl.xr.addEventListener('sessionend', onEnd)
    vrActions.enter = () => requestImmersive(gl)
    vrActions.exit = async () => {
      const session = gl.xr.getSession()
      if (session) await session.end()
    }
    return () => {
      cancelled = true
      gl.xr.removeEventListener('sessionstart', onStart)
      gl.xr.removeEventListener('sessionend', onEnd)
      vrActions.enter = null
      vrActions.exit = null
    }
  }, [gl, setPresenting, setSupported, setView])

  return null
}
