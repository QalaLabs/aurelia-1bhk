import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bath, BedDouble, ChefHat, DoorOpen, Sofa, TreePalm } from 'lucide-react';
import { ROOMS } from '../../data/layout.ts';
import { useApartment } from '../../context/ApartmentContext.tsx';
const ICONS = {
    foyer: DoorOpen,
    living: Sofa,
    bedroom: BedDouble,
    kitchen: ChefHat,
    bathroom: Bath,
    balcony: TreePalm,
};
const ORDER = ['foyer', 'living', 'bedroom', 'kitchen', 'bathroom', 'balcony'];
export function LeftSidebar({ open }) {
    const { selected, selectRoom } = useApartment();
    if (!open)
        return null;
    return (_jsxs("aside", { className: "absolute top-3 bottom-3 left-3 z-20 flex w-[272px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#16191e]/92 shadow-2xl shadow-black/40 backdrop-blur-md", children: [_jsxs("div", { className: "border-b border-white/10 px-4 py-3", children: [_jsx("p", { className: "text-[11px] tracking-[0.16em] text-[#9c958b] uppercase", children: "Rooms" }), _jsx("p", { className: "font-display mt-1 text-lg text-[#f6f1e8]", children: "Navigate the plan" })] }), _jsx("nav", { className: "flex-1 space-y-1 overflow-y-auto p-2", "aria-label": "Rooms", children: ORDER.map((id) => {
                    const room = ROOMS.find((item) => item.id === id);
                    if (!room)
                        return null;
                    const Icon = ICONS[id];
                    const active = selected === id;
                    return (_jsxs("button", { type: "button", onClick: () => selectRoom(id, true), "aria-current": active ? 'true' : undefined, className: `flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${active
                            ? 'border-[#c6a36a]/50 bg-[#2a241c] text-[#f6f1e8]'
                            : 'border-transparent text-[#d7d1c7] hover:bg-white/5'}`, children: [_jsx("span", { className: `grid h-10 w-10 shrink-0 place-items-center rounded-lg ${active ? 'bg-[#c6a36a] text-[#1b140c]' : 'bg-white/5 text-[#c6a36a]'}`, children: _jsx(Icon, { size: 18 }) }), _jsxs("span", { className: "min-w-0", children: [_jsx("span", { className: "block text-[14px] font-medium", children: room.name }), _jsxs("span", { className: "block text-[12px] text-[#a39c92]", children: [room.dimensions, " \u00B7 ", room.areaLabel] })] })] }, id));
                }) })] }));
}
