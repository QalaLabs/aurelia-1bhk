import { jsx as _jsx } from "react/jsx-runtime";
import { CameraControls, CameraControlsImpl } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { SHOTS } from '../../data/layout.ts';
import { useApartment } from '../../context/ApartmentContext.tsx';
function motionOff() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export function CameraRig() {
    const ref = useRef(null);
    const { tool, view, fpv, frame, framedRoom } = useApartment();
    useEffect(() => {
        const controls = ref.current;
        if (!controls)
            return;
        const action = CameraControlsImpl.ACTION;
        if (tool === 'orbit') {
            controls.mouseButtons.left = action.ROTATE;
            controls.mouseButtons.right = action.TRUCK;
            controls.mouseButtons.wheel = action.DOLLY;
        }
        else if (tool === 'pan') {
            controls.mouseButtons.left = action.TRUCK;
            controls.mouseButtons.right = action.ROTATE;
            controls.mouseButtons.wheel = action.DOLLY;
        }
        else {
            controls.mouseButtons.left = action.DOLLY;
            controls.mouseButtons.right = action.TRUCK;
            controls.mouseButtons.wheel = action.DOLLY;
        }
        controls.touches.one = tool === 'pan' ? action.TOUCH_TRUCK : action.TOUCH_ROTATE;
    }, [tool]);
    useEffect(() => {
        const controls = ref.current;
        if (!controls || fpv)
            return;
        const shot = framedRoom ? SHOTS[framedRoom] : SHOTS[view];
        void controls.setLookAt(shot.position[0], shot.position[1], shot.position[2], shot.target[0], shot.target[1], shot.target[2], !motionOff());
    }, [view, fpv, frame, framedRoom]);
    return (_jsx(CameraControls, { ref: ref, makeDefault: true, enabled: !fpv, smoothTime: motionOff() ? 0 : 0.45, dollyToCursor: true, minDistance: 2, maxDistance: 78, minPolarAngle: 0, maxPolarAngle: Math.PI / 2.05 }));
}
