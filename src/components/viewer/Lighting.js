import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Environment, Grid } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Component, Suspense, useLayoutEffect, useRef } from 'react';
import { Object3D } from 'three';
class QuietBoundary extends Component {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        if (this.state.failed)
            return null;
        return this.props.children;
    }
}
function ShadowBake() {
    const gl = useThree((state) => state.gl);
    const frames = useRef(0);
    useFrame(() => {
        frames.current += 1;
        if (frames.current <= 12)
            gl.shadowMap.needsUpdate = true;
    });
    return null;
}
function Sun() {
    const light = useRef(null);
    const target = useRef(null);
    useLayoutEffect(() => {
        if (light.current && target.current)
            light.current.target = target.current;
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("object3D", { ref: target, position: [13, 0, 10] }), _jsx("directionalLight", { ref: light, position: [6, 34, -12], intensity: 3.2, color: "#fff4e4", castShadow: true, "shadow-mapSize-width": 2048, "shadow-mapSize-height": 2048, "shadow-camera-near": 2, "shadow-camera-far": 80, "shadow-camera-left": -28, "shadow-camera-right": 28, "shadow-camera-top": 28, "shadow-camera-bottom": -28, "shadow-bias": -0.0004, "shadow-normalBias": 0.04 })] }));
}
export function Lighting() {
    return (_jsxs(_Fragment, { children: [_jsx("color", { attach: "background", args: ['#e4ddd2'] }), _jsx("hemisphereLight", { args: ['#fff6ea', '#c9b59a', 0.55] }), _jsx("ambientLight", { intensity: 0.18, color: "#fff4ea" }), _jsx(Sun, {}), _jsx("directionalLight", { position: [-16, 12, 18], intensity: 0.45, color: "#d7e4f2" }), _jsx(Grid, { position: [13, -0.4, 9], args: [80, 80], cellSize: 1, cellThickness: 0.5, cellColor: "#c9c0b3", sectionSize: 5, sectionThickness: 1, sectionColor: "#a89884", fadeDistance: 48, fadeStrength: 1.4, infiniteGrid: false }), _jsx(QuietBoundary, { children: _jsx(Suspense, { fallback: null, children: _jsx(Environment, { preset: "apartment", environmentIntensity: 0.48 }) }) }), _jsx(ShadowBake, {})] }));
}
