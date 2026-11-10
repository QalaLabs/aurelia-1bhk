import { ApartmentProvider } from './context/ApartmentContext.tsx'
import { AppShell } from './components/layout/AppShell.tsx'

export default function App() {
  return (
    <ApartmentProvider>
      <AppShell />
    </ApartmentProvider>
  )
}
