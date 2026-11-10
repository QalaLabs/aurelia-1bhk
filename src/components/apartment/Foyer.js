import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApartment } from '../../context/ApartmentContext.tsx';
import { mats } from '../../materials/library.ts';
import { Box } from './geometry.tsx';
import { Downlight, Mirror, Plant } from './decor.tsx';
import { Rug } from './seating.tsx';
export function Foyer() {
    const { visibility } = useApartment();
    return (_jsxs("group", { children: [_jsx(Downlight, { position: [14.4, 9.55, 17.6], intensity: 40 }), visibility.furniture && (_jsxs(_Fragment, { children: [_jsx(Rug, { position: [14.2, 0, 17.4], size: [3.4, 5.6] }), _jsx(Box, { size: [2.8, 1.15, 1.05], position: [10.6, 0.58, 20.7], material: mats.oak }), _jsx(Box, { size: [1.2, 0.9, 0.04], position: [10.2, 0.7, 21.22], material: mats.oakLight }), _jsx(Box, { size: [1.2, 0.9, 0.04], position: [11.15, 0.7, 21.22], material: mats.oakLight }), _jsx(Box, { size: [2.4, 2.4, 0.85], position: [19.85, 2.35, 17.4], material: mats.oak }), _jsx(Mirror, { position: [20.22, 5.15, 17.4], rotation: -Math.PI / 2, width: 1.8, height: 2.3 }), _jsx(Plant, { position: [17.6, 0, 19.9], scale: 0.75 }), _jsxs("group", { position: [19.7, 4.15, 14.35], children: [_jsx(Box, { size: [1.3, 0.08, 0.45], material: mats.teak, tile: 1 }), _jsx("mesh", { position: [0, 0.16, 0], material: mats.bulb, children: _jsx("sphereGeometry", { args: [0.08, 10, 8] }) }), _jsx("pointLight", { position: [0, 0.2, 0.3], intensity: 4, distance: 4, decay: 2, color: "#ffc98a" })] })] }))] }));
}
