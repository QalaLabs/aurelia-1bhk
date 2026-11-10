import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { mats } from '../../materials/library.ts';
import { Box, Cylinder } from './geometry.tsx';
import { TableLamp } from './decor.tsx';
export function Bed({ position, rotation = 0, }) {
    const width = 5.15;
    const length = 6.7;
    return (_jsxs("group", { position: position, rotation: [0, rotation, 0], children: [[
                [-1, -1],
                [1, -1],
                [-1, 1],
                [1, 1],
            ].map(([sx, sz], index) => (_jsx(Box, { size: [0.16, 0.7, 0.16], position: [(sx ?? 0) * (width / 2 - 0.2), 0.35, (sz ?? 0) * (length / 2 - 0.25)], material: mats.oakDark, tile: 1 }, index))), _jsx(Box, { size: [width + 0.15, 0.7, 0.28], position: [0, 1.55, -length / 2 + 0.02], material: mats.fabricDeep }), _jsx(Box, { size: [width - 0.15, 2.3, 0.22], position: [0, 2.7, -length / 2 + 0.08], material: mats.fabric }), _jsx(Box, { size: [width, 0.28, length - 0.15], position: [0, 0.84, 0.05], material: mats.oak }), _jsx(Box, { size: [width - 0.12, 0.55, length - 0.35], position: [0, 1.22, 0.12], material: mats.linen }), _jsx(Box, { size: [width - 0.28, 0.22, length * 0.62], position: [0, 1.5, 0.7], material: mats.linen }), _jsx(Box, { size: [1.55, 0.28, 0.85], position: [-0.95, 1.62, -length / 2 + 1.15], material: mats.ceramic }), _jsx(Box, { size: [1.55, 0.28, 0.85], position: [0.95, 1.62, -length / 2 + 1.15], material: mats.ceramic }), _jsx(Box, { size: [1.15, 0.22, 0.55], position: [-1.55, 1.58, -length / 2 + 1.7], material: mats.accent }), _jsx(Box, { size: [1.15, 0.22, 0.55], position: [1.55, 1.58, -length / 2 + 1.7], material: mats.accent })] }));
}
export function Nightstand({ position }) {
    return (_jsxs("group", { position: position, children: [_jsx(Box, { size: [1.35, 0.12, 1.25], position: [0, 0.06, 0], material: mats.oakDark }), _jsx(Box, { size: [1.28, 1.35, 1.18], position: [0, 0.78, 0], material: mats.oak }), _jsx(Box, { size: [1.1, 0.02, 0.02], position: [0, 0.85, 0.6], material: mats.oakDark, tile: 1, shadow: false }), _jsx(Box, { size: [0.16, 0.06, 0.05], position: [0, 1.15, 0.62], material: mats.brass, tile: 1 }), _jsx(TableLamp, { position: [0, 1.5, 0] })] }));
}
export function Wardrobe({ position, rotation = 0, }) {
    const width = 5.5;
    return (_jsxs("group", { position: position, rotation: [0, rotation, 0], children: [_jsx(Box, { size: [width, 0.18, 2], position: [0, 0.09, 0], material: mats.oakDark }), _jsx(Box, { size: [width, 7.15, 1.92], position: [0, 3.75, 0], material: mats.oak }), _jsx(Box, { size: [width, 0.12, 2.05], position: [0, 7.35, 0], material: mats.oakDark }), [-1.8, 0, 1.8].map((x) => (_jsxs("group", { children: [_jsx(Box, { size: [1.68, 6.55, 0.05], position: [x, 3.7, 0.98], material: mats.oakLight }), _jsx(Box, { size: [1.4, 0.015, 0.012], position: [x, 3.7, 1.02], material: mats.oakDark, tile: 1, shadow: false }), _jsx(Box, { size: [0.06, 0.55, 0.06], position: [x + 0.62, 3.6, 1.04], material: mats.brass, tile: 1 })] }, x)))] }));
}
