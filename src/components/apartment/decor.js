import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { mats } from '../../materials/library.ts';
import { Box, Cylinder } from './geometry.tsx';
function prefersStillMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export function Plant({ position, scale = 1, }) {
    return (_jsxs("group", { position: position, scale: scale, children: [_jsx(Cylinder, { radius: [0.42, 0.34], height: 0.7, position: [0, 0.35, 0], material: mats.terracotta }), _jsx(Cylinder, { radius: 0.36, height: 0.08, position: [0, 0.72, 0], material: mats.oakDark, shadow: false }), _jsx("mesh", { position: [0, 1.55, 0], material: mats.plant, castShadow: true, children: _jsx("sphereGeometry", { args: [0.72, 16, 12] }) }), _jsx("mesh", { position: [0.38, 1.25, 0.2], material: mats.plantDark, castShadow: true, children: _jsx("sphereGeometry", { args: [0.48, 14, 10] }) }), _jsx("mesh", { position: [-0.32, 1.3, -0.18], material: mats.plant, castShadow: true, children: _jsx("sphereGeometry", { args: [0.5, 14, 10] }) })] }));
}
export function WallArt({ position, rotation = 0, width = 2.6, height = 1.8, }) {
    return (_jsxs("group", { position: position, rotation: [0, rotation, 0], children: [_jsx(Box, { size: [width + 0.16, height + 0.16, 0.08], material: mats.oakDark, tile: 2 }), _jsx(Box, { size: [width - 0.08, height - 0.08, 0.02], position: [0, 0, 0.045], material: mats.linen, tile: 2, shadow: false }), _jsx(Box, { size: [width * 0.45, height * 0.55, 0.01], position: [-width * 0.12, 0.05, 0.06], material: mats.accent, tile: 1, shadow: false })] }));
}
export function Curtain({ position, rotation = 0, width, height, }) {
    const folds = 8;
    const foldW = width / folds;
    return (_jsxs("group", { position: position, rotation: [0, rotation, 0], children: [_jsx(Box, { size: [width + 0.3, 0.1, 0.12], position: [0, height / 2 + 0.08, 0], material: mats.metalDark, tile: 2 }), Array.from({ length: folds }, (_, index) => {
                const x = -width / 2 + foldW * (index + 0.5);
                const wave = index % 2 === 0 ? 0.05 : -0.03;
                return (_jsx(Box, { size: [foldW * 0.92, height, 0.06], position: [x, 0, wave], material: mats.curtain, tile: 2 }, index));
            })] }));
}
export function TableLamp({ position }) {
    return (_jsxs("group", { position: position, children: [_jsx(Cylinder, { radius: 0.16, height: 0.08, position: [0, 0.04, 0], material: mats.brass, segments: 16 }), _jsx(Cylinder, { radius: 0.05, height: 0.7, position: [0, 0.42, 0], material: mats.brass }), _jsx("mesh", { position: [0, 0.95, 0], material: mats.lampShade, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.28, 0.36, 0.42, 16] }) }), _jsx("pointLight", { position: [0, 0.9, 0], intensity: 6, distance: 8, decay: 2, color: "#ffd7a8" })] }));
}
export function Downlight({ position, intensity = 55, }) {
    return (_jsxs("group", { position: position, children: [_jsx(Box, { size: [0.9, 0.06, 0.9], material: mats.ceramic, tile: 1, shadow: false }), _jsx("mesh", { position: [0, -0.04, 0], rotation: [-Math.PI / 2, 0, 0], material: mats.bulb, children: _jsx("circleGeometry", { args: [0.28, 20] }) }), _jsx("pointLight", { position: [0, -0.2, 0], intensity: intensity, distance: 20, decay: 2, color: "#fff1dd" })] }));
}
export function CeilingFan({ position }) {
    const blades = useRef(null);
    const still = useRef(prefersStillMotion());
    useFrame((_, delta) => {
        if (still.current || !blades.current)
            return;
        blades.current.rotation.y += Math.min(delta, 0.05) * 1.5;
    });
    return (_jsxs("group", { position: position, children: [_jsx(Cylinder, { radius: 0.12, height: 0.35, position: [0, 0.2, 0], material: mats.metalDark }), _jsx("group", { ref: blades, children: [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((rotation) => (_jsx(Box, { size: [2.6, 0.04, 0.38], position: [Math.cos(rotation) * 1.15, 0, Math.sin(rotation) * 1.15], rotation: [0, -rotation, 0.08], material: mats.oakDark, tile: 2 }, rotation))) }), _jsx("mesh", { position: [0, -0.08, 0], material: mats.bulb, children: _jsx("sphereGeometry", { args: [0.12, 12, 10] }) })] }));
}
export function Mirror({ position, rotation = 0, width = 2.2, height = 3.2, }) {
    return (_jsxs("group", { position: position, rotation: [0, rotation, 0], children: [_jsx(Box, { size: [width + 0.14, height + 0.14, 0.08], material: mats.oak, tile: 2 }), _jsx(Box, { size: [width, height, 0.02], position: [0, 0, 0.05], material: mats.glass, tile: 2, shadow: false })] }));
}
