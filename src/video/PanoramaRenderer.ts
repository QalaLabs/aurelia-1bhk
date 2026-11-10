import {
  GLSL3,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  UnsignedByteType,
  WebGLRenderTarget,
  type CubeTexture,
  type WebGLRenderer,
} from 'three'

const vertexShader = /* glsl */ `
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform samplerCube envMap;
  in vec2 vUv;
  out vec4 fragColor;
  const float PI = 3.141592653589793;
  void main() {
    float lon = (vUv.x - 0.5) * 2.0 * PI;
    float lat = (0.5 - vUv.y) * PI;
    vec3 dir = vec3(sin(lon) * cos(lat), sin(lat), cos(lon) * cos(lat));
    fragColor = texture(envMap, normalize(dir));
  }
`

export class PanoramaRenderer {
  private width = 0
  private height = 0
  private target: WebGLRenderTarget | null = null
  private readonly scene = new Scene()
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private readonly material = new ShaderMaterial({
    glslVersion: GLSL3,
    uniforms: { envMap: { value: null } },
    vertexShader,
    fragmentShader,
    toneMapped: false,
    depthTest: false,
    depthWrite: false,
  })
  private readonly mesh = new Mesh(new PlaneGeometry(2, 2), this.material)

  constructor() {
    this.scene.add(this.mesh)
  }

  private ensure(width: number, height: number) {
    if (this.target && this.width === width && this.height === height) return
    this.target?.dispose()
    this.width = width
    this.height = height
    this.target = new WebGLRenderTarget(width, height, {
      format: RGBAFormat,
      type: UnsignedByteType,
      depthBuffer: false,
      stencilBuffer: false,
      colorSpace: SRGBColorSpace,
    })
  }

  project(gl: WebGLRenderer, cube: CubeTexture, width: number, height: number) {
    this.ensure(width, height)
    if (!this.target) throw new Error('Equirect target is not ready')
    this.material.uniforms.envMap.value = cube
    const previous = gl.getRenderTarget()
    const previousAutoClear = gl.autoClear
    gl.autoClear = true
    gl.setRenderTarget(this.target)
    gl.render(this.scene, this.camera)
    const pixels = new Uint8Array(width * height * 4)
    gl.readRenderTargetPixels(this.target, 0, 0, width, height, pixels)
    gl.setRenderTarget(previous)
    gl.autoClear = previousAutoClear
    return pixels
  }

  dispose() {
    this.target?.dispose()
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
