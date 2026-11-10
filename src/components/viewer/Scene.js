import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Canvas, useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from 'three';
import { Architecture } from '../apartment/Architecture.tsx';
import { useApartment } from '../../context/ApartmentContext.tsx';
import { CameraRig } from './CameraRig.tsx';
import { FirstPerson } from './FirstPerson.tsx';
import { Lighting } from './Lighting.tsx';
import { RoomLabels } from './markers.tsx';
function PickLayer() {
    const raycaster = useThree((state) => state.raycaster);
    useLayoutEffect(() => {
        raycaster.layers.set(1);
    }, [raycaster]);
    return null;
}
export function Scene() {
    const { fpv } = useApartment();
    return (_jsxs(Canvas, { className: fpv ? 'cursor-none' : undefined, shadows: true, dpr: [1, 1.6], camera: { position: [46, 32, 42], fov: 38, near: 0.1, far: 220 }, gl: {
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            outputColorSpace: SRGBColorSpace,
        }, onCreated: ({ gl }) => {
            gl.shadowMap.type = PCFSoftShadowMap;
            gl.shadowMap.autoUpdate = false;
            gl.shadowMap.needsUpdate = true;
        }, children: [_jsx(PickLayer, {}), _jsx(Lighting, {}), _jsx(Architecture, {}), _jsx(RoomLabels, {}), _jsx(CameraRig, {}), _jsx(FirstPerson, {})] }));
}
