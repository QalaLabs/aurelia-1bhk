import { jsx as _jsx } from "react/jsx-runtime";
import { ApartmentProvider } from './context/ApartmentContext.tsx';
import { AppShell } from './components/layout/AppShell.tsx';
export default function App() {
    return (_jsx(ApartmentProvider, { children: _jsx(AppShell, {}) }));
}
