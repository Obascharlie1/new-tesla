'use client'

import { Menu, BadgeCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useTopBarContext } from './TopBarContext'
import { NotificationBell } from './NotificationBell'

interface TopBarProps {
  title: string
  subtitle?: string
  verified?: boolean
}

export function TopBar({ title, subtitle, verified }: TopBarProps) {
  const { onMenuOpen } = useTopBarContext()

  return (
    <header className="h-16 sticky top-0 z-30 bg-light-base dark:bg-dark-base border-b border-light-border dark:border-dark-border px-4 sm:px-6 flex items-center justify-between">
      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-dark-base dark:text-white leading-tight">{title}</h1>
            {verified && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/25 border border-emerald-200 dark:border-emerald-700/50">
                <BadgeCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Verified</span>
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationBell />
        <ThemeToggle />
      </div>
    </header>
  )
}
