import { ApartmentProvider } from './context/ApartmentContext.tsx'
import { AppShell } from './components/layout/AppShell.tsx'
import { StudioProvider } from './studio/StudioContext.tsx'

export default function App() {
  return (
    <ApartmentProvider>
      <StudioProvider>
        <AppShell />
      </StudioProvider>
    </ApartmentProvider>
  )
}
