import { createContext, useContext, useMemo, useState } from 'react'

const MotionContext = createContext(null)

function systemReduced() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function MotionProvider({ children }) {
  const [enabled, setEnabled] = useState(() => !systemReduced())
  const value = useMemo(
    () => ({ enabled, toggle: () => setEnabled((e) => !e) }),
    [enabled],
  )
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotionPreference() {
  const ctx = useContext(MotionContext)
  if (!ctx) throw new Error('useMotionPreference must be inside MotionProvider')
  return ctx
}
