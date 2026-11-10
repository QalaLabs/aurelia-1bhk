import { Bloom, BrightnessContrast, DepthOfField, EffectComposer, HueSaturation, SSAO, Vignette } from '@react-three/postprocessing'
import { useStudio } from '../studio/StudioContext.tsx'

export function Grade() {
  const presenting = useStudio((state) => state.xrPresenting)
  const dof = useStudio((state) => state.settings.dof)
  if (presenting) return null

  return (
    <EffectComposer multisampling={0} enableNormalPass>
      <SSAO
        samples={12}
        rings={3}
        intensity={1.6}
        radius={0.12}
        luminanceInfluence={0.45}
        bias={0.04}
        worldDistanceThreshold={5}
        worldDistanceFalloff={1.2}
      />
      <Bloom intensity={0.16} luminanceThreshold={0.85} mipmapBlur />
      {dof ? <DepthOfField worldFocusDistance={14} worldFocusRange={18} bokehScale={1.2} /> : null}
      <BrightnessContrast brightness={0.012} contrast={0.05} />
      <HueSaturation hue={0.008} saturation={0.05} />
      <Vignette eskil={false} offset={0.2} darkness={0.5} />
    </EffectComposer>
  )
}
