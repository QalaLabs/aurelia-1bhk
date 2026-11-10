import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Eye, EyeOff } from 'lucide-react';
import { CARPET_SQFT, roomById } from '../../data/layout.ts';
import { useApartment } from '../../context/ApartmentContext.tsx';
const TOGGLES = [
    { key: 'walls', label: 'Walls' },
    { key: 'ceiling', label: 'Ceiling' },
    { key: 'furniture', label: 'Furniture' },
    { key: 'labels', label: 'Room labels' },
];
export function RightPanel({ open }) {
    const { selected, visibility, toggle } = useApartment();
    if (!open)
        return null;
    const room = selected ? roomById(selected) : null;
    return (_jsxs("aside", { className: "absolute top-3 right-3 bottom-3 z-20 flex w-[300px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#16191e]/92 shadow-2xl shadow-black/40 backdrop-blur-md", children: [_jsxs("div", { className: "border-b border-white/10 px-4 py-3", children: [_jsx("p", { className: "text-[11px] tracking-[0.16em] text-[#9c958b] uppercase", children: room ? 'Selected room' : 'Apartment' }), _jsx("h2", { className: "font-display mt-1 text-xl text-[#f6f1e8]", children: room ? room.name : 'Aurelia 1BHK' })] }), _jsxs("div", { className: "flex-1 space-y-5 overflow-y-auto px-4 py-4", children: [room ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-[13px] leading-relaxed text-[#c9c2b6]", children: room.summary }), _jsxs("dl", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { className: "rounded-xl bg-white/5 px-3 py-2", children: [_jsx("dt", { className: "text-[11px] text-[#9c958b]", children: "Dimensions" }), _jsx("dd", { className: "mt-1 text-[14px] text-[#f6f1e8]", children: room.dimensions })] }), _jsxs("div", { className: "rounded-xl bg-white/5 px-3 py-2", children: [_jsx("dt", { className: "text-[11px] text-[#9c958b]", children: "Area" }), _jsx("dd", { className: "mt-1 text-[14px] text-[#f6f1e8]", children: room.areaLabel })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-[11px] tracking-[0.14em] text-[#9c958b] uppercase", children: "Finishes" }), _jsx("ul", { className: "mt-2 space-y-1.5 text-[13px] text-[#e7e1d6]", children: room.finishes.map((item) => (_jsxs("li", { className: "flex gap-2", children: [_jsx("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c6a36a]" }), item] }, item))) })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-[11px] tracking-[0.14em] text-[#9c958b] uppercase", children: "Furniture" }), _jsx("ul", { className: "mt-2 space-y-1.5 text-[13px] text-[#e7e1d6]", children: room.furniture.map((item) => (_jsx("li", { children: item }, item))) })] })] })) : (_jsxs("p", { className: "text-[13px] leading-relaxed text-[#c9c2b6]", children: [CARPET_SQFT, " sq ft carpet across living, bedroom, closed kitchen, foyer, and attached bath, plus a south balcony. Select a room to read its dimensions and fit-out."] })), _jsxs("section", { children: [_jsx("h3", { className: "text-[11px] tracking-[0.14em] text-[#9c958b] uppercase", children: "Visibility" }), _jsx("div", { className: "mt-2 space-y-1", children: TOGGLES.map((item) => {
                                    const on = visibility[item.key];
                                    return (_jsxs("button", { type: "button", "aria-pressed": on, onClick: () => toggle(item.key), className: "flex h-11 w-full items-center justify-between rounded-xl border border-white/10 px-3 text-[13px] text-[#f3efe6] hover:bg-white/5", children: [_jsx("span", { children: item.label }), _jsxs("span", { className: "flex items-center gap-1.5 text-[#c6a36a]", children: [on ? _jsx(Eye, { size: 15 }) : _jsx(EyeOff, { size: 15 }), on ? 'Shown' : 'Hidden'] })] }, item.key));
                                }) })] })] })] }));
}
