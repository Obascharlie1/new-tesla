'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBarContext } from '@/components/dashboard/TopBarContext'
import { PriceTicker } from '@/components/dashboard/PriceTicker'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <TopBarContext.Provider value={{ onMenuOpen: () => setMobileOpen(true) }}>
      <div className="relative min-h-screen">
        {/* Animated spectrum aurora — sits behind the whole dashboard */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[#070707]" />
          {/* Drifting colored blobs; wrapper slowly hue-rotates through the spectrum */}
          <div className="aurora-wrap absolute inset-0">
            <div className="aurora-blob-a absolute -top-32 -left-24 w-[55vw] h-[55vw] rounded-full bg-[#E0241C]/55 blur-[110px]" />
            <div className="aurora-blob-b absolute top-1/4 -right-24 w-[50vw] h-[50vw] rounded-full bg-[#10B981]/45 blur-[120px]" />
            <div className="aurora-blob-c absolute bottom-0 left-1/4 w-[48vw] h-[48vw] rounded-full bg-[#3B82F6]/45 blur-[120px]" />
            <div className="aurora-blob-d absolute top-1/3 left-1/3 w-[42vw] h-[42vw] rounded-full bg-[#A855F7]/40 blur-[110px]" />
          </div>
          {/* Darkening veil so foreground content stays readable */}
          <div className="absolute inset-0 bg-[#070707]/40" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="lg:ml-64">
          <PriceTicker />
          {children}
        </div>
      </div>
    </TopBarContext.Provider>
  )
}
