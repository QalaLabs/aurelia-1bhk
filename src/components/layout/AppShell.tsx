import { useEffect, useState } from 'react'
import { useApartment } from '../../context/ApartmentContext.tsx'
import { Scene } from '../viewer/Scene.tsx'
import { BottomBar } from './BottomBar.tsx'
import { LeftSidebar } from './LeftSidebar.tsx'
import { RightPanel } from './RightPanel.tsx'
import { TopBar } from './TopBar.tsx'

export function AppShell() {
  const { fpv, setFpv, selectRoom, setView, resetView } = useApartment()
  const [showNav, setShowNav] = useState(true)
  const [showInfo, setShowInfo] = useState(true)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1100px)')
    const apply = () => {
      if (query.matches) {
        setShowNav(false)
        setShowInfo(false)
      }
    }
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement && target.closest('input, textarea')) return
      if (event.key === 'Escape') setFpv(false)
      if (event.key === '1') selectRoom('living', true)
      if (event.key === '2') selectRoom('bedroom', true)
      if (event.key === '3') selectRoom('kitchen', true)
      if (event.key === '4') selectRoom('bathroom', true)
      if (event.key === '5') selectRoom('balcony', true)
      if (event.key === '0') selectRoom('foyer', true)
      if (event.key === 'f' || event.key === 'F') setView('top')
      if (event.key === 'r' || event.key === 'R') resetView()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [resetView, selectRoom, setFpv, setView])

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#101114] text-[#f3efe6]">
      <TopBar
        showNav={showNav}
        showInfo={showInfo}
        onToggleNav={() => setShowNav((value) => !value)}
        onToggleInfo={() => setShowInfo((value) => !value)}
      />
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>
        <LeftSidebar open={showNav} />
        <RightPanel open={showInfo} />
        {fpv && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/15 bg-[#14171c]/90 px-4 py-2 text-[12px] text-[#f3efe6]">
            Click to look · WASD to walk · Esc to exit
          </div>
        )}
      </div>
      <BottomBar />
    </div>
  )
}
