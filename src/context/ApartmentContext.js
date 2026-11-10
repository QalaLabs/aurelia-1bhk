import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState, } from 'react';
const ApartmentContext = createContext(null);
const INITIAL_VISIBILITY = {
    walls: true,
    ceiling: false,
    furniture: true,
    labels: true,
};
export function ApartmentProvider({ children }) {
    const [selected, setSelected] = useState('living');
    const [view, setViewState] = useState('iso');
    const [tool, setTool] = useState('orbit');
    const [visibility, setVisibility] = useState(INITIAL_VISIBILITY);
    const [fpv, setFpvState] = useState(false);
    const [frame, setFrame] = useState(0);
    const [framedRoom, setFramedRoom] = useState(null);
    const selectRoom = useCallback((id, frameCamera = false) => {
        setSelected(id);
        setFpvState(false);
        if (frameCamera) {
            setFramedRoom(id);
            setFrame((value) => value + 1);
        }
    }, []);
    const clearSelection = useCallback(() => setSelected(null), []);
    const setView = useCallback((next) => {
        setFpvState(false);
        setFramedRoom(null);
        setViewState(next);
    }, []);
    const toggle = useCallback((key) => {
        setVisibility((current) => ({ ...current, [key]: !current[key] }));
    }, []);
    const setFpv = useCallback((active) => {
        setFpvState(active);
        if (active)
            setFramedRoom(null);
    }, []);
    const resetView = useCallback(() => {
        setFpvState(false);
        setFramedRoom(null);
        setTool('orbit');
        setViewState('iso');
        setFrame((value) => value + 1);
    }, []);
    const value = useMemo(() => ({
        selected,
        view,
        tool,
        visibility,
        fpv,
        frame,
        framedRoom,
        selectRoom,
        clearSelection,
        setView,
        setTool,
        toggle,
        setFpv,
        resetView,
    }), [
        selected,
        view,
        tool,
        visibility,
        fpv,
        frame,
        framedRoom,
        selectRoom,
        clearSelection,
        setView,
        setTool,
        toggle,
        setFpv,
        resetView,
    ]);
    return _jsx(ApartmentContext.Provider, { value: value, children: children });
}
export function useApartment() {
    const value = useContext(ApartmentContext);
    if (!value)
        throw new Error('useApartment must be used inside ApartmentProvider');
    return value;
}
