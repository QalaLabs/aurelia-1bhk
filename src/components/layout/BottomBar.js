import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Hand, Move3d, PersonStanding, Square, ZoomIn } from 'lucide-react';
import { useApartment } from '../../context/ApartmentContext.tsx';
const TOOLS = [
    { id: 'orbit', label: 'Orbit', icon: Move3d },
    { id: 'zoom', label: 'Zoom', icon: ZoomIn },
    { id: 'pan', label: 'Pan', icon: Hand },
];
const PRESETS = [
    { id: 'iso', label: 'Isometric' },
    { id: 'top', label: 'Top' },
    { id: 'interior', label: 'Interior' },
];
export function BottomBar() {
    const { tool, setTool, view, setView, fpv, setFpv, framedRoom } = useApartment();
    return (_jsxs("footer", { className: "flex h-16 shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#14171c] px-3 sm:px-4", children: [_jsx("div", { className: "flex items-center gap-1 rounded-xl border border-white/10 bg-[#101216] p-1", children: TOOLS.map((item) => {
                    const Icon = item.icon;
                    const active = tool === item.id && !fpv;
                    return (_jsxs("button", { type: "button", "aria-pressed": active, onClick: () => {
                            setFpv(false);
                            setTool(item.id);
                        }, className: `flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] ${active ? 'bg-[#2a241c] text-[#f0d7ae]' : 'text-[#c9c2b6] hover:text-white'}`, children: [_jsx(Icon, { size: 15 }), _jsx("span", { className: "hidden sm:inline", children: item.label })] }, item.id));
                }) }), _jsxs("div", { className: "flex items-center gap-1 overflow-x-auto", children: [PRESETS.map((item) => {
                        const active = !fpv && !framedRoom && view === item.id;
                        return (_jsxs("button", { type: "button", "aria-pressed": active, onClick: () => setView(item.id), className: `flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[13px] ${active
                                ? 'border-[#c6a36a]/60 bg-[#2a241c] text-[#f0d7ae]'
                                : 'border-white/10 text-[#c9c2b6] hover:text-white'}`, children: [item.id === 'top' ? _jsx(Square, { size: 14 }) : null, item.label] }, item.id));
                    }), _jsxs("button", { type: "button", "aria-pressed": fpv, onClick: () => setFpv(!fpv), className: `flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[13px] ${fpv
                            ? 'border-[#c6a36a]/60 bg-[#c6a36a] text-[#1b140c]'
                            : 'border-white/10 text-[#c9c2b6] hover:text-white'}`, children: [_jsx(PersonStanding, { size: 15 }), "Walk"] })] })] }));
}
