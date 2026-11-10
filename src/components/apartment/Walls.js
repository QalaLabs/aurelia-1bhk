import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { WALLS } from '../../data/layout.ts';
import { mats } from '../../materials/library.ts';
import { useApartment } from '../../context/ApartmentContext.tsx';
import { Box } from './geometry.tsx';
function sliceWall(length, height, openings) {
    const sorted = [...openings].sort((a, b) => a.at - b.at);
    const pieces = [];
    let cursor = 0;
    for (const opening of sorted) {
        const left = Math.max(0, opening.at - opening.width / 2);
        const right = Math.min(length, opening.at + opening.width / 2);
        if (left > cursor + 0.01) {
            const sx = left - cursor;
            pieces.push({ cx: cursor + sx / 2, cy: height / 2, sx, sy: height });
        }
        if (opening.sill > 0.02 && right > left) {
            pieces.push({
                cx: (left + right) / 2,
                cy: opening.sill / 2,
                sx: right - left,
                sy: opening.sill,
            });
        }
        const head = opening.sill + opening.height;
        if (head < height - 0.02 && right > left) {
            const sy = height - head;
            pieces.push({
                cx: (left + right) / 2,
                cy: head + sy / 2,
                sx: right - left,
                sy,
            });
        }
        cursor = Math.max(cursor, right);
    }
    if (cursor < length - 0.01) {
        const sx = length - cursor;
        pieces.push({ cx: cursor + sx / 2, cy: height / 2, sx, sy: height });
    }
    return pieces;
}
function skirtOffsets(side) {
    if (side === 'both')
        return [1, -1];
    if (side === 'pos')
        return [1];
    if (side === 'neg')
        return [-1];
    return [];
}
function DoorLeaf({ opening, thickness, }) {
    const leafW = opening.width - 0.16;
    const leafH = opening.height - 0.08;
    const hinge = opening.hinge === 'max' ? opening.at + opening.width / 2 : opening.at - opening.width / 2;
    const dir = opening.hinge === 'max' ? -1 : 1;
    const swing = opening.swing ?? 0.6;
    const material = opening.kind === 'entrance' ? mats.teak : mats.paint;
    return (_jsxs("group", { position: [hinge, opening.sill, 0], rotation: [0, dir * swing, 0], children: [_jsx(Box, { size: [leafW, leafH, 0.12], position: [dir * leafW * 0.5, leafH * 0.5, 0], material: material, tile: 3 }), _jsx(Box, { size: [0.08, 0.5, 0.08], position: [dir * (leafW - 0.18), 3.15, thickness * 0.5], material: mats.brass, tile: 1 }), opening.kind === 'entrance' && (_jsx("mesh", { position: [dir * leafW * 0.5, 4.7, 0.07], material: mats.brass, children: _jsx("cylinderGeometry", { args: [0.06, 0.06, 0.04, 12] }) }))] }));
}
function WindowUnit({ opening, thickness, interior, }) {
    const glassMat = opening.kind === 'vent' ? mats.frost : mats.glass;
    const frame = 0.08;
    return (_jsxs("group", { position: [opening.at, opening.sill + opening.height / 2, 0], children: [_jsx(Box, { size: [opening.width + 0.12, opening.height + 0.12, thickness + 0.08], material: mats.aluminum, tile: 2 }), _jsx(Box, { size: [opening.width - frame * 2, opening.height - frame * 2, 0.04], material: glassMat, tile: 2, shadow: false }), opening.kind === 'window' && opening.width > 3 && (_jsx(Box, { size: [0.06, opening.height - 0.1, 0.07], material: mats.aluminum, tile: 1 })), _jsx(Box, { size: [opening.width + 0.28, 0.09, 0.28], position: [0, -opening.height / 2, interior * (thickness / 2 + 0.02)], material: mats.skirting, tile: 2 })] }));
}
function Slider({ opening, thickness }) {
    const panelW = opening.width / 2 + 0.08;
    const panelH = opening.height - 0.12;
    return (_jsxs("group", { position: [opening.at, opening.sill, 0], children: [_jsx(Box, { size: [opening.width + 0.2, 0.12, thickness + 0.16], position: [0, opening.height - 0.02, 0], material: mats.aluminum, tile: 2 }), _jsx(Box, { size: [opening.width + 0.2, 0.08, 0.28], position: [0, 0.04, 0], material: mats.aluminum, tile: 2 }), [
                { x: -opening.width * 0.22, z: -0.06 },
                { x: opening.width * 0.08, z: 0.08 },
            ].map((panel) => (_jsxs("group", { position: [panel.x, panelH / 2 + 0.06, panel.z], children: [_jsx(Box, { size: [panelW, panelH, 0.08], material: mats.aluminum, tile: 2 }), _jsx(Box, { size: [panelW - 0.16, panelH - 0.16, 0.03], material: mats.glass, tile: 2, shadow: false })] }, panel.x)))] }));
}
function Wall({ wall }) {
    const dx = wall.b[0] - wall.a[0];
    const dz = wall.b[1] - wall.a[1];
    const length = Math.hypot(dx, dz);
    const angle = Math.atan2(dz, dx);
    const pieces = useMemo(() => sliceWall(length, wall.height, wall.openings), [length, wall.height, wall.openings]);
    const interior = wall.skirt === 'neg' ? -1 : 1;
    return (_jsxs("group", { position: [wall.a[0], 0, wall.a[1]], rotation: [0, -angle, 0], children: [pieces.map((piece) => (_jsx(Box, { size: [piece.sx, piece.sy, wall.thickness], position: [piece.cx, piece.cy, 0], material: mats.plaster, tile: 4 }, `${piece.cx}-${piece.cy}`))), pieces
                .filter((piece) => piece.cy - piece.sy / 2 < 0.05)
                .flatMap((piece) => skirtOffsets(wall.skirt).map((side) => (_jsx(Box, { size: [piece.sx, 0.38, 0.045], position: [
                    piece.cx,
                    0.19,
                    side * (wall.thickness / 2 + 0.02),
                ], material: mats.skirting, tile: 3, shadow: false }, `sk-${piece.cx}-${side}`)))), wall.openings.map((item) => {
                if (item.kind === 'window' || item.kind === 'vent') {
                    return (_jsx(WindowUnit, { opening: item, thickness: wall.thickness, interior: interior }, item.id));
                }
                if (item.kind === 'sliding') {
                    return _jsx(Slider, { opening: item, thickness: wall.thickness }, item.id);
                }
                return (_jsxs("group", { children: [_jsx(Box, { size: [0.14, item.height, wall.thickness + 0.1], position: [item.at - item.width / 2, item.height / 2, 0], material: mats.paint, tile: 2 }), _jsx(Box, { size: [0.14, item.height, wall.thickness + 0.1], position: [item.at + item.width / 2, item.height / 2, 0], material: mats.paint, tile: 2 }), _jsx(Box, { size: [item.width, 0.16, wall.thickness + 0.1], position: [item.at, item.height + 0.08, 0], material: mats.paint, tile: 2 }), _jsx(DoorLeaf, { opening: item, thickness: wall.thickness })] }, item.id));
            })] }));
}
export function Walls() {
    const { visibility } = useApartment();
    if (!visibility.walls)
        return null;
    return (_jsx("group", { children: WALLS.map((item) => (_jsx(Wall, { wall: item }, item.id))) }));
}
export function Slab() {
    return (_jsx("mesh", { position: [13.2, -0.2, 8.9], receiveShadow: true, material: mats.concrete, children: _jsx("boxGeometry", { args: [29.2, 0.4, 27.6] }) }));
}
export function Ground() {
    return (_jsx("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [13, -0.42, 9], receiveShadow: true, material: mats.ground, children: _jsx("circleGeometry", { args: [70, 48] }) }));
}
