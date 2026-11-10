import {
  CubeCamera,
  LinearFilter,
  RGBAFormat,
  SRGBColorSpace,
  UnsignedByteType,
  WebGLCubeRenderTarget,
  type Scene,
  type WebGLRenderer,
} from 'three'

export function faceSizeFor(width: number, maxTexture: number) {
  const wanted = Math.max(256, Math.min(2048, Math.floor(width / 2)))
  return Math.min(wanted, maxTexture)
}

export class CubemapRenderer {
  private face = 0
  private target: WebGLCubeRenderTarget | null = null
  private camera: CubeCamera | null = null

  ensure(face: number) {
    if (this.target && this.face === face) return this
    this.camera?.removeFromParent()
    this.target?.dispose()
    this.face = face
    this.target = new WebGLCubeRenderTarget(face, {
      format: RGBAFormat,
      type: UnsignedByteType,
      generateMipmaps: false,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      colorSpace: SRGBColorSpace,
    })
    this.camera = new CubeCamera(0.08, 240, this.target)
    return this
  }

  render(gl: WebGLRenderer, scene: Scene, position: [number, number, number]) {
    if (!this.camera || !this.target) throw new Error('Cubemap is not ready')
    const previousTarget = gl.getRenderTarget()
    const previousAutoClear = gl.autoClear
    const previousXr = gl.xr.enabled
    gl.xr.enabled = false
    gl.autoClear = true
    gl.setRenderTarget(null)
    this.camera.position.set(position[0], position[1], position[2])
    this.camera.update(gl, scene)
    gl.xr.enabled = previousXr
    gl.autoClear = previousAutoClear
    gl.setRenderTarget(previousTarget)
    return this.target
  }

  dispose() {
    this.target?.dispose()
    this.target = null
    this.camera = null
  }
}
