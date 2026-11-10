import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Html } from '@react-three/drei';
import { ROOMS } from '../../data/layout.ts';
import { useApartment } from '../../context/ApartmentContext.tsx';
export function RoomLabels() {
    const { visibility, selected } = useApartment();
    if (!visibility.labels)
        return null;
    return (_jsx("group", { children: ROOMS.map((room) => {
            const active = selected === room.id;
            return (_jsx(Html, { position: [(room.x0 + room.x1) / 2, 3.4, (room.z0 + room.z1) / 2], center: true, distanceFactor: 16, zIndexRange: [30, 0], style: { pointerEvents: 'none' }, children: _jsxs("div", { className: `rounded-full px-3 py-1 text-[11px] tracking-wide whitespace-nowrap ${active
                        ? 'bg-[#c6a36a] text-[#1a140c]'
                        : 'bg-[#14171c]/80 text-[#f3efe6] border border-white/15'}`, children: [room.name, _jsxs("span", { className: active ? 'text-[#3a2c18]' : 'text-[#b7b1a6]', children: [" \u00B7 ", room.dimensions] })] }) }, room.id));
        }) }));
}
