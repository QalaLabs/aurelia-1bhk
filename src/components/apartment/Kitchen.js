import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { mats } from '../../materials/library.ts';
import { useApartment } from '../../context/ApartmentContext.tsx';
import { Box, Cylinder } from './geometry.tsx';
import { Downlight } from './decor.tsx';
function CabinetRun({ start, fixed, length, depth, height, y, axis, front, doors, }) {
    const door = depth / 2 + 0.02;
    return (_jsx("group", { children: Array.from({ length: doors }, (_, index) => {
            const span = length / doors;
            const along = start + span * (index + 0.5);
            const x = axis === 'x' ? along : fixed;
            const z = axis === 'z' ? along : fixed;
            const sx = axis === 'x' ? span - 0.06 : depth;
            const sz = axis === 'z' ? span - 0.06 : depth;
            const doorPos = axis === 'x' ? [x, y, z + front * door] : [x + front * door, y, z];
            const handle = axis === 'x'
                ? [x + span * 0.28, y, z + front * (door + 0.04)]
                : [x + front * (door + 0.04), y, z + span * 0.28];
            return (_jsxs("group", { children: [_jsx(Box, { size: [sx, height, sz], position: [x, y, z], material: mats.oakLight }), _jsx(Box, { size: axis === 'x' ? [span - 0.16, height - 0.16, 0.04] : [0.04, height - 0.16, span - 0.16], position: doorPos, material: mats.paint }), _jsx(Box, { size: [0.05, 0.28, 0.05], position: handle, material: mats.brass, tile: 1 })] }, index));
        }) }));
}
function Counter({ position, size, }) {
    return _jsx(Box, { size: size, position: position, material: mats.marble, tile: 2.2 });
}
export function Kitchen() {
    const { visibility } = useApartment();
    const show = visibility.furniture;
    return (_jsxs("group", { children: [_jsx(Downlight, { position: [2.6, 9.55, 17.2], intensity: 48 }), _jsx(Downlight, { position: [5.4, 9.55, 19.4], intensity: 42 }), show && (_jsxs(_Fragment, { children: [_jsx(CabinetRun, { start: 13.7, fixed: 1.05, length: 5.5, depth: 2, height: 2.7, y: 1.45, axis: "z", front: 1, doors: 3 }), _jsx(CabinetRun, { start: 2.15, fixed: 20.35, length: 5.5, depth: 1.9, height: 2.7, y: 1.45, axis: "x", front: -1, doors: 3 }), _jsx(Counter, { position: [1.08, 2.92, 16.45], size: [2.08, 0.12, 5.6] }), _jsx(Counter, { position: [4.9, 2.92, 20.32], size: [5.6, 0.12, 2.02] }), _jsx(Box, { size: [1.7, 0.16, 1.15], position: [4.1, 2.9, 20.15], material: mats.metalDark, tile: 1 }), _jsx(Cylinder, { radius: 0.04, height: 0.7, position: [4.55, 3.35, 20.55], material: mats.brass }), _jsx("mesh", { position: [4.35, 3.72, 20.35], rotation: [0, 0, Math.PI / 2], material: mats.brass, children: _jsx("torusGeometry", { args: [0.22, 0.035, 8, 16, Math.PI] }) }), _jsx(Box, { size: [1.35, 0.04, 1.55], position: [1.15, 3.02, 16.7], material: mats.metalDark, tile: 1 }), [
                        [-0.28, -0.32],
                        [0.28, -0.32],
                        [-0.28, 0.32],
                        [0.28, 0.32],
                    ].map(([x, z], index) => (_jsx("mesh", { position: [1.15 + (x ?? 0), 3.06, 16.7 + (z ?? 0)], material: mats.metal, children: _jsx("torusGeometry", { args: [0.16, 0.02, 8, 16] }) }, index))), _jsx(Box, { size: [1.5, 0.7, 1.15], position: [1.2, 5.15, 16.7], material: mats.metal }), _jsx(Box, { size: [0.7, 2.4, 0.55], position: [1.2, 6.7, 16.55], material: mats.metal }), _jsx(CabinetRun, { start: 13.75, fixed: 0.85, length: 2.1, depth: 1.15, height: 2.15, y: 5.55, axis: "z", front: 1, doors: 1 }), _jsx(CabinetRun, { start: 18.3, fixed: 0.85, length: 2.5, depth: 1.15, height: 2.15, y: 5.55, axis: "z", front: 1, doors: 1 }), _jsx(CabinetRun, { start: 6.15, fixed: 20.55, length: 1.5, depth: 1.1, height: 2.05, y: 5.5, axis: "x", front: -1, doors: 1 }), _jsx(Box, { size: [1.9, 1.55, 0.03], position: [0.2, 3.85, 16.4], material: mats.kitchenTile, tile: 1.2, shadow: false }), _jsx(Box, { size: [2.4, 1.2, 0.03], position: [6.4, 3.7, 21.25], material: mats.kitchenTile, tile: 1.2, shadow: false }), _jsxs("group", { position: [6.55, 0, 14.55], children: [_jsx(Box, { size: [2.35, 6.15, 2.15], position: [0, 3.1, 0], material: mats.metal }), _jsx(Box, { size: [0.03, 4.3, 2.05], position: [1.16, 3.7, 0], material: mats.aluminum }), _jsx(Box, { size: [0.04, 3.2, 0.08], position: [1.2, 4.3, 0.55], material: mats.metalDark, tile: 1 }), _jsx(Box, { size: [0.04, 1.3, 0.08], position: [1.2, 1.55, 0.55], material: mats.metalDark, tile: 1 })] })] }))] }));
}
