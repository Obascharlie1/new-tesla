'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBarContext } from '@/components/dashboard/TopBarContext'
import { PriceTicker } from '@/components/dashboard/PriceTicker'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <TopBarContext.Provider value={{ onMenuOpen: () => setMobileOpen(true) }}>
      <div className="relative min-h-screen bg-light-surface dark:bg-dark-surface">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="lg:ml-64">
          <PriceTicker />
          {children}
        </div>
      </div>
    </TopBarContext.Provider>
  )
}
