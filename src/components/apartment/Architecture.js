import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Balcony } from './Balcony.tsx';
import { Bathroom } from './Bathroom.tsx';
import { Bedroom } from './Bedroom.tsx';
import { Ceilings, Floors } from './Floors.tsx';
import { Foyer } from './Foyer.tsx';
import { Kitchen } from './Kitchen.tsx';
import { LivingRoom } from './LivingRoom.tsx';
import { Ground, Slab, Walls } from './Walls.tsx';
export function Architecture() {
    return (_jsxs("group", { children: [_jsx(Ground, {}), _jsx(Slab, {}), _jsx(Floors, {}), _jsx(Walls, {}), _jsx(Ceilings, {}), _jsx(LivingRoom, {}), _jsx(Bedroom, {}), _jsx(Kitchen, {}), _jsx(Bathroom, {}), _jsx(Foyer, {}), _jsx(Balcony, {})] }));
}
