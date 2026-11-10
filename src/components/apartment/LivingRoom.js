import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApartment } from '../../context/ApartmentContext.tsx';
import { CeilingFan, Curtain, Plant, WallArt } from './decor.tsx';
import { CoffeeTable, FloorLamp, Rug, Sofa, TvUnit } from './seating.tsx';
export function LivingRoom() {
    const { visibility } = useApartment();
    return (_jsxs("group", { children: [_jsx(CeilingFan, { position: [7.2, 9.15, 6.4] }), visibility.furniture && (_jsxs(_Fragment, { children: [_jsx(Rug, { position: [5.4, 0, 6.3], size: [8.6, 6.8] }), _jsx(Sofa, { position: [5.3, 0, 4.85] }), _jsx(CoffeeTable, { position: [5.4, 0, 7.85] }), _jsx(TvUnit, { position: [3.7, 0, 12.15], rotation: Math.PI }), _jsx(Plant, { position: [13.4, 0, 1.35] }), _jsx(Plant, { position: [1.25, 0, 11.15], scale: 0.8 }), _jsx(WallArt, { position: [14.82, 5.3, 8.6], rotation: -Math.PI / 2, width: 2.8, height: 1.9 }), _jsx(Curtain, { position: [0.22, 4.55, 6.2], rotation: Math.PI / 2, width: 5.6, height: 6.4 }), _jsx(FloorLamp, { position: [12.4, 0, 4.4] })] }))] }));
}
