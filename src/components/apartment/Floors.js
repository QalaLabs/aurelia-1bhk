import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Line } from '@react-three/drei';
import { ROOMS } from '../../data/layout.ts';
import { mats } from '../../materials/library.ts';
import { useApartment } from '../../context/ApartmentContext.tsx';
import { Box } from './geometry.tsx';
const FLOOR_MAT = {
    wood: mats.woodFloor,
    kitchen: mats.kitchenTile,
    bath: mats.bathFloor,
    stone: mats.stone,
};
const TILE = {
    wood: 3.2,
    kitchen: 2.2,
    bath: 1.6,
    stone: 2.4,
};
function center(room) {
    return [(room.x0 + room.x1) / 2, 0.025, (room.z0 + room.z1) / 2];
}
export function Floors() {
    const { selected, selectRoom, fpv } = useApartment();
    return (_jsx("group", { children: ROOMS.map((room) => {
            const width = room.x1 - room.x0;
            const depth = room.z1 - room.z0;
            const [x, y, z] = center(room);
            const active = selected === room.id;
            return (_jsxs("group", { children: [_jsx(Box, { size: [width, 0.05, depth], position: [x, y, z], material: FLOOR_MAT[room.floor], tile: TILE[room.floor], shadow: false }), _jsxs("mesh", { layers: 1, position: [x, 0.06, z], rotation: [-Math.PI / 2, 0, 0], onClick: (event) => {
                            if (fpv)
                                return;
                            event.stopPropagation();
                            selectRoom(room.id);
                        }, onPointerOver: (event) => {
                            event.stopPropagation();
                            document.body.style.cursor = fpv ? 'none' : 'pointer';
                        }, onPointerOut: () => {
                            document.body.style.cursor = 'auto';
                        }, children: [_jsx("planeGeometry", { args: [width, depth] }), _jsx("meshBasicMaterial", { transparent: true, opacity: 0, depthWrite: false })] }), active && (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [x, 0.09, z], rotation: [-Math.PI / 2, 0, 0], material: mats.highlight, children: _jsx("planeGeometry", { args: [width - 0.08, depth - 0.08] }) }), _jsx(Line, { points: [
                                    [room.x0, 0.14, room.z0],
                                    [room.x1, 0.14, room.z0],
                                    [room.x1, 0.14, room.z1],
                                    [room.x0, 0.14, room.z1],
                                    [room.x0, 0.14, room.z0],
                                ], color: "#e2c48a", lineWidth: 1 })] }))] }, room.id));
        }) }));
}
export function Ceilings() {
    const { visibility, view } = useApartment();
    if (!visibility.ceiling || view === 'top')
        return null;
    return (_jsx("group", { children: ROOMS.filter((room) => room.ceiling).map((room) => (_jsx(Box, { size: [room.x1 - room.x0, 0.12, room.z1 - room.z0], position: [(room.x0 + room.x1) / 2, 9.98, (room.z0 + room.z1) / 2], material: mats.plaster, tile: 4, shadow: false }, room.id))) }));
}
