import type { Pose } from '../cinematics/CameraPaths.ts'

export type StudioBridge = {
  maxTexture: number
  prepare: () => void
  restore: () => void
  captureFrame: (
    pose: Pose,
    width: number,
    height: number,
    fade: number,
    seconds: number,
  ) => Promise<Blob>
  captureEquirect: (
    position: [number, number, number],
    width: number,
    height: number,
    fade: number,
  ) => Promise<Blob>
}

export const studioBridge: { current: StudioBridge | null } = { current: null }
