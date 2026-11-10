/** Clear height of the apartment, in feet. */
export const CEILING = 10;
/**
 * Carpet plan, feet. Origin at the living-room south-west inner corner.
 * +X east, +Z north, +Y up.
 *
 * Living 15×13 and bedroom 11×13 share the south band.
 * Kitchen, foyer, and bathroom share the north band.
 * Foyer doors reach living and bedroom. Bathroom opens from the bedroom.
 * Balcony sits outside the living room, through a sliding door.
 */
export const ROOMS = [
    {
        id: 'living',
        name: 'Living Room',
        x0: 0,
        z0: 0,
        x1: 15,
        z1: 13,
        floor: 'wood',
        ceiling: true,
        dimensions: '15 × 13 ft',
        areaLabel: '195 sq ft',
        area: 195,
        summary: 'Main living bay with a north media wall, west daylight, and a south balcony.',
        finishes: ['White-oak plank floor', 'Warm plaster walls', 'Oak skirting'],
        furniture: [
            'Three-seater sofa',
            'Coffee table',
            'Media unit and television',
            'Area rug',
            'Floor lamp',
            'Plants and wall art',
        ],
    },
    {
        id: 'bedroom',
        name: 'Bedroom',
        x0: 15.4,
        z0: 0,
        x1: 26.4,
        z1: 13,
        floor: 'wood',
        ceiling: true,
        dimensions: '11 × 13 ft',
        areaLabel: '143 sq ft',
        area: 143,
        summary: 'Queen bedroom with an attached bath, east and south windows, and a full-height wardrobe.',
        finishes: ['White-oak plank floor', 'Upholstered headboard', 'Linen drapery'],
        furniture: [
            'Queen bed with mattress and pillows',
            'Pair of bedside tables and lamps',
            'Three-door wardrobe',
            'Dressing mirror',
            'Curtains',
        ],
    },
    {
        id: 'kitchen',
        name: 'Kitchen',
        x0: 0,
        z0: 13.4,
        x1: 8,
        z1: 21.4,
        floor: 'kitchen',
        ceiling: true,
        dimensions: '8 × 8 ft',
        areaLabel: '64 sq ft',
        area: 64,
        summary: 'Closed modular kitchen. Sink under the north window, hob on the west run, fridge at the south end.',
        finishes: ['Stone countertop', 'Large-format floor tile', 'Gloss backsplash'],
        furniture: [
            'Base and overhead cabinets',
            'Stone countertop',
            'Sink and faucet',
            'Two-burner gas hob',
            'Chimney',
            'Refrigerator',
        ],
    },
    {
        id: 'foyer',
        name: 'Foyer',
        x0: 8.4,
        z0: 13.4,
        x1: 20.4,
        z1: 21.4,
        floor: 'wood',
        ceiling: true,
        dimensions: '12 × 8 ft',
        areaLabel: '96 sq ft',
        area: 96,
        summary: 'Entry gallery. Main door to the north, kitchen to the west, living and bedroom to the south.',
        finishes: ['Oak floor', 'Teak entrance door', 'Brass hardware'],
        furniture: ['Shoe cabinet', 'Console and mirror', 'Runner rug', 'Entry plant'],
    },
    {
        id: 'bathroom',
        name: 'Bathroom',
        x0: 20.8,
        z0: 13.4,
        x1: 26.4,
        z1: 21.4,
        floor: 'bath',
        ceiling: true,
        dimensions: '5.6 × 8 ft',
        areaLabel: '45 sq ft',
        area: 44.8,
        summary: 'Attached bath. Shower on the east, water closet to the north-west, vanity on the west wall.',
        finishes: ['Matt wall tile', 'Stone-look floor tile', 'Framed mirror'],
        furniture: [
            'Western water closet',
            'Vanity and washbasin',
            'Glass shower partition',
            'Mirror',
            'Towel rail and accessories',
        ],
    },
    {
        id: 'balcony',
        name: 'Balcony',
        x0: 3.5,
        z0: -4.15,
        x1: 11.5,
        z1: -0.6,
        floor: 'stone',
        ceiling: false,
        dimensions: '8 × 4 ft',
        areaLabel: '32 sq ft',
        area: 32,
        summary: 'South balcony off the living room, with a glass railing and outdoor seating.',
        finishes: ['Textured stone tile', 'Charcoal metal railing', 'Clear glass infill'],
        furniture: ['Two outdoor chairs', 'Side table', 'Planters'],
    },
];
export const CARPET_SQFT = 543;
export function roomById(id) {
    const room = ROOMS.find((item) => item.id === id);
    if (!room)
        throw new Error(`Unknown room ${id}`);
    return room;
}
function opening(id, kind, at, width, height, sill, hinge, swing = 0.62) {
    return { id, kind, at, width, height, sill, hinge, swing };
}
function wall(id, a, b, thickness, skirt, openings = []) {
    return { id, a, b, thickness, height: CEILING, skirt, openings };
}
const EXT = 0.6;
const INT = 0.4;
export const WALLS = [
    wall('ext-south', [-0.6, -0.3], [27, -0.3], EXT, 'pos', [
        opening('slider', 'sliding', 8.1, 6, 7.15, 0),
        opening('bed-south-win', 'window', 24.3, 3.4, 4.2, 2.75),
    ]),
    wall('ext-north', [-0.6, 21.7], [27, 21.7], EXT, 'neg', [
        opening('kit-north-win', 'window', 4.6, 3.6, 3.5, 3.35),
        opening('entry', 'entrance', 15.1, 3.5, 7.25, 0, 'min', 0.7),
        opening('bath-vent', 'vent', 24.4, 1.7, 1.35, 5.7),
    ]),
    wall('ext-west', [-0.3, 0], [-0.3, 21.4], EXT, 'neg', [
        opening('liv-west-win', 'window', 6.2, 5, 4.7, 2.6),
    ]),
    wall('ext-east', [26.7, 0], [26.7, 21.4], EXT, 'pos', [
        opening('bed-east-win', 'window', 7.2, 5.2, 5, 2.45),
        opening('bath-east-vent', 'vent', 19.4, 1.5, 1.25, 5.85),
    ]),
    wall('living-bedroom', [15.2, 0], [15.2, 13], INT, 'both', [
        opening('door-liv-bed', 'door', 3.5, 3, 7, 0, 'min', 0.7),
    ]),
    wall('living-kitchen', [0, 13.2], [8, 13.2], INT, 'both'),
    wall('living-foyer', [8.4, 13.2], [15, 13.2], INT, 'both', [
        opening('door-liv-foyer', 'door', 3.2, 3.2, 7, 0, 'max', -0.65),
    ]),
    wall('foyer-bedroom', [15.4, 13.2], [20.4, 13.2], INT, 'both', [
        opening('door-foyer-bed', 'door', 2.4, 2.8, 7, 0, 'min', 0.6),
    ]),
    wall('bedroom-bath', [20.8, 13.2], [26.4, 13.2], INT, 'both', [
        opening('door-bed-bath', 'door', 2.8, 2.5, 7, 0, 'min', -0.55),
    ]),
    wall('kitchen-foyer', [8.2, 13.4], [8.2, 21.4], INT, 'both', [
        opening('door-kit-foyer', 'door', 4, 2.7, 7, 0, 'min', 0.65),
    ]),
    wall('foyer-bath', [20.6, 13.4], [20.6, 21.4], INT, 'both'),
];
/** Extra colliders so a walk-through cannot step off the balcony. */
export const RAIL_COLLIDERS = [
    wall('rail-s', [3.5, -4.15], [11.5, -4.15], 0.16, 'none'),
    wall('rail-w', [3.5, -4.15], [3.5, -0.55], 0.16, 'none'),
    wall('rail-e', [11.5, -4.15], [11.5, -0.55], 0.16, 'none'),
];
export const SHOTS = {
    iso: { position: [34, 24, 32], target: [12.5, 1.2, 10] },
    top: { position: [13, 42, 10.15], target: [13, 0, 10] },
    interior: { position: [2.6, 5.5, 2.4], target: [8.5, 3.4, 8] },
    living: { position: [6.5, 6.4, -2.4], target: [6.2, 3.2, 7.2] },
    bedroom: { position: [24.8, 6.8, -1.6], target: [20.2, 3.2, 7] },
    kitchen: { position: [12.2, 6.2, 17.2], target: [3.6, 3.4, 17.6] },
    bathroom: { position: [23.4, 6.4, 12.2], target: [23.6, 3.6, 18] },
    balcony: { position: [7.5, 5.8, -8.2], target: [7.5, 2.4, 1.5] },
    foyer: { position: [14.2, 7.2, 11.6], target: [14.4, 3.4, 18] },
};
export const WALK_ZONES = [
    ...ROOMS.map((room) => ({
        x0: room.x0 - 0.85,
        z0: room.z0 - 0.85,
        x1: room.x1 + 0.85,
        z1: room.z1 + 0.85,
    })),
    { x0: 11.2, z0: 21.2, x1: 18.2, z1: 24.4 },
];
