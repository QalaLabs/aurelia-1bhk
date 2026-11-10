import type { ReactNode } from 'react'
import { useStudio } from '../studio/StudioContext.tsx'
import { METERS_PER_FOOT } from './Teleportation.tsx'

/** Scales the existing apartment into meters only while a headset session is presenting. */
export function VRNavigation({ children }: { children: ReactNode }) {
  const presenting = useStudio((state) => state.xrPresenting)
  return <group scale={presenting ? METERS_PER_FOOT : 1}>{children}</group>
}
