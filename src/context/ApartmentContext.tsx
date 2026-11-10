import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  NavTool,
  RoomId,
  ViewPreset,
  Visibility,
} from '../types/apartment.ts'

type ApartmentState = {
  selected: RoomId | null
  view: ViewPreset
  tool: NavTool
  visibility: Visibility
  fpv: boolean
  frame: number
  framedRoom: RoomId | null
  selectRoom: (id: RoomId, frameCamera?: boolean) => void
  clearSelection: () => void
  setView: (view: ViewPreset) => void
  setTool: (tool: NavTool) => void
  toggle: (key: keyof Visibility) => void
  setFpv: (active: boolean) => void
  resetView: () => void
}

const ApartmentContext = createContext<ApartmentState | null>(null)

const INITIAL_VISIBILITY: Visibility = {
  walls: true,
  ceiling: false,
  furniture: true,
  labels: true,
}

export function ApartmentProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<RoomId | null>('living')
  const [view, setViewState] = useState<ViewPreset>('iso')
  const [tool, setTool] = useState<NavTool>('orbit')
  const [visibility, setVisibility] = useState<Visibility>(INITIAL_VISIBILITY)
  const [fpv, setFpvState] = useState(false)
  const [frame, setFrame] = useState(0)
  const [framedRoom, setFramedRoom] = useState<RoomId | null>(null)

  const selectRoom = useCallback((id: RoomId, frameCamera = false) => {
    setSelected(id)
    setFpvState(false)
    if (frameCamera) {
      setFramedRoom(id)
      setFrame((value) => value + 1)
    }
  }, [])

  const clearSelection = useCallback(() => setSelected(null), [])

  const setView = useCallback((next: ViewPreset) => {
    setFpvState(false)
    setFramedRoom(null)
    setViewState(next)
  }, [])

  const toggle = useCallback((key: keyof Visibility) => {
    setVisibility((current) => ({ ...current, [key]: !current[key] }))
  }, [])

  const setFpv = useCallback((active: boolean) => {
    setFpvState(active)
    if (active) setFramedRoom(null)
  }, [])

  const resetView = useCallback(() => {
    setFpvState(false)
    setFramedRoom(null)
    setTool('orbit')
    setViewState('iso')
    setFrame((value) => value + 1)
  }, [])

  const value = useMemo<ApartmentState>(
    () => ({
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
    }),
    [
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
    ],
  )

  return <ApartmentContext.Provider value={value}>{children}</ApartmentContext.Provider>
}

export function useApartment() {
  const value = useContext(ApartmentContext)
  if (!value) throw new Error('useApartment must be used inside ApartmentProvider')
  return value
}
