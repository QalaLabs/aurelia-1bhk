import * as THREE from 'three';
function clampByte(value) {
    return Math.max(0, Math.min(255, value));
}
function canvasTex(canvas, color = true) {
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
}
function paint(hex, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        throw new Error('Canvas unavailable');
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, width, height);
    return { canvas, ctx };
}
function noisePass(ctx, amount) {
    const { width, height } = ctx.canvas;
    const image = ctx.getImageData(0, 0, width, height);
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
        const n = (Math.random() - 0.5) * amount;
        data[i] = clampByte((data[i] ?? 0) + n);
        data[i + 1] = clampByte((data[i + 1] ?? 0) + n);
        data[i + 2] = clampByte((data[i + 2] ?? 0) + n);
    }
    ctx.putImageData(image, 0, 0);
}
function makePlaster(hex) {
    const { canvas, ctx } = paint(hex, 256, 256);
    noisePass(ctx, 16);
    for (let i = 0; i < 18; i += 1) {
        ctx.fillStyle = `rgba(255,255,255,${0.015 + Math.random() * 0.03})`;
        ctx.beginPath();
        ctx.ellipse(Math.random() * 256, Math.random() * 256, 20 + Math.random() * 40, 10 + Math.random() * 20, Math.random(), 0, Math.PI * 2);
        ctx.fill();
    }
    return canvasTex(canvas);
}
function makeWood(base, seam) {
    const { canvas, ctx } = paint(base, 512, 512);
    noisePass(ctx, 18);
    for (let y = 0; y < 512; y += 64) {
        ctx.fillStyle = seam;
        ctx.fillRect(0, y, 512, 3);
        for (let g = 0; g < 5; g += 1) {
            ctx.strokeStyle = `rgba(90, 48, 18, ${0.05 + Math.random() * 0.08})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            const gy = y + 8 + g * 11;
            ctx.moveTo(0, gy);
            ctx.bezierCurveTo(140, gy - 4, 300, gy + 6, 512, gy - 2);
            ctx.stroke();
        }
    }
    return canvasTex(canvas);
}
function makeTile(base, grout, cell) {
    const { canvas, ctx } = paint(grout, 512, 512);
    for (let y = 0; y < 512; y += cell) {
        for (let x = 0; x < 512; x += cell) {
            const shift = (Math.random() - 0.5) * 10;
            ctx.fillStyle = base;
            ctx.fillRect(x + 4, y + 4, cell - 8, cell - 8);
            ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.04})`;
            ctx.fillRect(x + 4, y + 4, cell - 8, 8 + shift);
        }
    }
    noisePass(ctx, 8);
    return canvasTex(canvas);
}
function makeMarble() {
    const { canvas, ctx } = paint('#e7e2d8', 512, 512);
    noisePass(ctx, 10);
    ctx.strokeStyle = 'rgba(168, 160, 148, 0.45)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 7; i += 1) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, 0);
        ctx.bezierCurveTo(Math.random() * 512, 160, Math.random() * 512, 320, Math.random() * 512, 512);
        ctx.stroke();
    }
    return canvasTex(canvas);
}
function makeFabric(hex) {
    const { canvas, ctx } = paint(hex, 256, 256);
    noisePass(ctx, 22);
    ctx.strokeStyle = 'rgba(90, 70, 50, 0.05)';
    for (let y = 0; y < 256; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y + 1);
        ctx.stroke();
    }
    return canvasTex(canvas);
}
function makeRug() {
    const { canvas, ctx } = paint('#cbb79a', 512, 512);
    noisePass(ctx, 14);
    ctx.strokeStyle = '#8d7354';
    ctx.lineWidth = 28;
    ctx.strokeRect(20, 20, 472, 472);
    ctx.strokeStyle = '#e6d7bf';
    ctx.lineWidth = 8;
    ctx.strokeRect(42, 42, 428, 428);
    ctx.strokeStyle = 'rgba(120, 90, 60, 0.25)';
    ctx.lineWidth = 2;
    for (let i = 70; i < 450; i += 28) {
        ctx.beginPath();
        ctx.moveTo(70, i);
        ctx.lineTo(442, i);
        ctx.stroke();
    }
    return canvasTex(canvas);
}
function makeScreen() {
    const { canvas, ctx } = paint('#14181c', 512, 288);
    const glow = ctx.createRadialGradient(180, 120, 20, 220, 140, 260);
    glow.addColorStop(0, '#6d8290');
    glow.addColorStop(0.45, '#2c3842');
    glow.addColorStop(1, '#101418');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 512, 288);
    ctx.fillStyle = 'rgba(232, 196, 148, 0.35)';
    ctx.fillRect(300, 70, 90, 120);
    return canvasTex(canvas);
}
function keep(material) {
    material.dispose = () => { };
    return material;
}
const plasterMap = makePlaster('#f4f0e7');
const woodFloorMap = makeWood('#b58962', 'rgba(74, 44, 22, 0.45)');
const woodMap = makeWood('#c4a574', 'rgba(90, 56, 24, 0.4)');
const woodDarkMap = makeWood('#8a5a32', 'rgba(40, 22, 10, 0.5)');
const fabricMap = makeFabric('#e4d3bf');
const fabricDeepMap = makeFabric('#cbb89f');
const linenMap = makeFabric('#f6f1e8');
const marbleMap = makeMarble();
const kitchenTileMap = makeTile('#e7e1d6', '#c9c0b2', 128);
const bathTileMap = makeTile('#f3f1ec', '#ddd6cc', 128);
const bathFloorMap = makeTile('#d5cec3', '#b7aea2', 96);
const stoneMap = makeTile('#cfc4b4', '#b3a794', 160);
const rugMap = makeRug();
const screenMap = makeScreen();
function standard(color, roughness, metalness = 0, map, env = 0.35) {
    return keep(new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        map: map ?? null,
        envMapIntensity: env,
    }));
}
export const mats = {
    plaster: standard('#f4f0e7', 0.93, 0, plasterMap, 0.22),
    skirting: standard('#f7f4ee', 0.78, 0, undefined, 0.2),
    woodFloor: standard('#c49a72', 0.62, 0, woodFloorMap, 0.28),
    oak: standard('#c4a574', 0.58, 0, woodMap, 0.32),
    oakDark: standard('#8a5a32', 0.55, 0, woodDarkMap, 0.3),
    oakLight: standard('#e6d3b4', 0.6, 0, undefined, 0.25),
    fabric: standard('#e4d3bf', 0.88, 0, fabricMap, 0.12),
    fabricDeep: standard('#cbb89f', 0.9, 0, fabricDeepMap, 0.12),
    linen: standard('#f7f3ec', 0.86, 0, linenMap, 0.12),
    accent: standard('#c6a36a', 0.72, 0, undefined, 0.2),
    marble: standard('#e7e2d8', 0.34, 0.04, marbleMap, 0.55),
    kitchenTile: standard('#e7e1d6', 0.55, 0.02, kitchenTileMap, 0.3),
    bathTile: standard('#f3f1ec', 0.48, 0.02, bathTileMap, 0.3),
    bathFloor: standard('#d5cec3', 0.5, 0.03, bathFloorMap, 0.28),
    stone: standard('#cfc4b4', 0.72, 0.02, stoneMap, 0.25),
    ceramic: standard('#f7f7f5', 0.28, 0.02, undefined, 0.45),
    paint: standard('#fbf9f5', 0.42, 0.02, undefined, 0.3),
    teak: standard('#6e4524', 0.48, 0.04, woodDarkMap, 0.35),
    metal: standard('#d8d8d4', 0.28, 0.86, undefined, 1),
    metalDark: standard('#3c3d40', 0.38, 0.78, undefined, 0.9),
    aluminum: standard('#c5c8cc', 0.32, 0.72, undefined, 0.9),
    brass: standard('#b08d57', 0.34, 0.82, undefined, 1),
    plant: standard('#3f6d49', 0.8, 0, undefined, 0.2),
    plantDark: standard('#2c5136', 0.82, 0, undefined, 0.18),
    terracotta: standard('#a46345', 0.7, 0.02, undefined, 0.25),
    curtain: standard('#f4efe6', 0.9, 0, linenMap, 0.1),
    sheer: standard('#f7f4ee', 0.4, 0, undefined, 0.2),
    concrete: standard('#cfc6ba', 0.92, 0, undefined, 0.15),
    ground: standard('#d5cfc4', 1, 0, undefined, 0.05),
    lampShade: keep(new THREE.MeshStandardMaterial({
        color: '#fff6e8',
        emissive: '#ffd9a8',
        emissiveIntensity: 0.85,
        roughness: 0.6,
    })),
    bulb: keep(new THREE.MeshStandardMaterial({
        color: '#fff4df',
        emissive: '#ffe2b0',
        emissiveIntensity: 2.4,
        roughness: 0.4,
    })),
    screen: keep(new THREE.MeshStandardMaterial({
        color: '#9eb0bc',
        map: screenMap,
        emissive: '#6f8ea0',
        emissiveMap: screenMap,
        emissiveIntensity: 0.55,
        roughness: 0.18,
        metalness: 0.1,
    })),
    rug: keep(new THREE.MeshStandardMaterial({
        color: '#ffffff',
        map: rugMap,
        roughness: 0.96,
        metalness: 0,
    })),
    highlight: keep(new THREE.MeshBasicMaterial({
        color: '#c6a36a',
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
    })),
    glass: keep(new THREE.MeshPhysicalMaterial({
        color: '#e7eef0',
        roughness: 0.04,
        metalness: 0,
        transmission: 0.9,
        thickness: 0.08,
        ior: 1.5,
        transparent: true,
        envMapIntensity: 1.15,
    })),
    showerGlass: keep(new THREE.MeshPhysicalMaterial({
        color: '#e4f1ef',
        roughness: 0.08,
        metalness: 0,
        transmission: 0.72,
        thickness: 0.08,
        transparent: true,
        envMapIntensity: 1,
    })),
    frost: keep(new THREE.MeshPhysicalMaterial({
        color: '#f4f7f6',
        roughness: 0.42,
        metalness: 0,
        transmission: 0.55,
        thickness: 0.06,
        transparent: true,
        envMapIntensity: 0.6,
    })),
};
mats.sheer.transparent = true;
mats.sheer.opacity = 0.38;
mats.sheer.depthWrite = false;
mats.glass.side = THREE.DoubleSide;
mats.showerGlass.side = THREE.DoubleSide;
mats.frost.side = THREE.DoubleSide;
