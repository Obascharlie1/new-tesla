'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type DashTheme = 'classic' | 'red'

interface Ctx {
  theme: DashTheme
  toggle: () => void
}

const DashboardThemeContext = createContext<Ctx>({ theme: 'classic', toggle: () => {} })

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<DashTheme>('classic')

  useEffect(() => {
    const stored = localStorage.getItem('dash-theme') as DashTheme | null
    if (stored === 'classic' || stored === 'red') setTheme(stored)
  }, [])

  function toggle() {
    setTheme(prev => {
      const next = prev === 'classic' ? 'red' : 'classic'
      localStorage.setItem('dash-theme', next)
      return next
    })
  }

  return (
    <DashboardThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </DashboardThemeContext.Provider>
  )
}

export const useDashTheme = () => useContext(DashboardThemeContext)
