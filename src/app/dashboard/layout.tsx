'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBarContext } from '@/components/dashboard/TopBarContext'
import { PriceTicker } from '@/components/dashboard/PriceTicker'
import { DashboardThemeProvider } from '@/components/dashboard/DashboardThemeContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <DashboardThemeProvider>
      <TopBarContext.Provider value={{ onMenuOpen: () => setMobileOpen(true) }}>
        <div className="min-h-screen bg-light-surface dark:bg-dark-surface">
          <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          <div className="lg:ml-64">
            <PriceTicker />
            {children}
          </div>
        </div>
      </TopBarContext.Provider>
    </DashboardThemeProvider>
  )
}
