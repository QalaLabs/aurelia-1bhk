import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApartment } from '../../context/ApartmentContext.tsx';
import { Bed, Nightstand, Wardrobe } from './bedroomSet.tsx';
import { CeilingFan, Curtain, Mirror } from './decor.tsx';
export function Bedroom() {
    const { visibility } = useApartment();
    return (_jsxs("group", { children: [_jsx(CeilingFan, { position: [21.2, 9.15, 7.4] }), visibility.furniture && (_jsxs(_Fragment, { children: [_jsx(Bed, { position: [19.2, 0, 8.5], rotation: Math.PI / 2 }), _jsx(Nightstand, { position: [16.85, 0, 5.15] }), _jsx(Nightstand, { position: [16.85, 0, 11.7] }), _jsx(Wardrobe, { position: [18.45, 0, 1.1] }), _jsx(Mirror, { position: [20.6, 4.7, 12.78], width: 2.15, height: 4.3 }), _jsx(Curtain, { position: [26.15, 4.7, 7.2], rotation: -Math.PI / 2, width: 5.8, height: 7.2 }), _jsx(Curtain, { position: [23.7, 4.9, 0.22], width: 3.8, height: 6.6 })] }))] }));
}
