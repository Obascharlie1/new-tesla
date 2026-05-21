'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  History,
  User,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard',              label: 'Dashboard',    icon: LayoutDashboard, exact: true },
  { href: '/dashboard/deposit',      label: 'Deposit',      icon: ArrowDownToLine },
  { href: '/dashboard/withdraw',     label: 'Withdraw',     icon: ArrowUpFromLine },
  { href: '/dashboard/plans',        label: 'My Plans',     icon: TrendingUp },
  { href: '/dashboard/transactions', label: 'Transactions', icon: History },
  { href: '/dashboard/profile',      label: 'Profile',      icon: User },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const [userName,  setUserName]  = useState('')
  const [userEmail, setUserEmail] = useState('')

  // Close on route change
  useEffect(() => { onClose() }, [pathname])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Fetch current user info
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserEmail(user.email ?? '')
      supabase.from('profiles').select('full_name').eq('id', user.id).single()
        .then(({ data }) => { if (data?.full_name) setUserName(data.full_name) })
    })
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  const NavContent = () => (
    <>
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-red-primary/10 text-red-primary border-l-2 border-red-primary pl-[10px]'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-light-surface dark:hover:bg-dark-card hover:text-dark-base dark:hover:text-white border-l-2 border-transparent'
              )}
            >
              <item.icon size={17} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-light-border dark:border-dark-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-red-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {userName ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '…'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-dark-base dark:text-white truncate">{userName || 'Loading…'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white hover:bg-light-surface dark:hover:bg-dark-card transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar (always visible) ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col bg-light-base dark:bg-dark-base border-r border-light-border dark:border-dark-border z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-light-border dark:border-dark-border">
          <div className="w-8 h-8 bg-red-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <span className="font-bold text-dark-base dark:text-white text-base tracking-tight">
            Quantum<span className="text-red-primary">Vest</span>
          </span>
        </div>
        <NavContent />
      </aside>

      {/* ── Mobile slide-out drawer ── */}
      {/* Backdrop */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 bg-black/60 transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          'lg:hidden fixed left-0 top-0 h-full w-72 flex flex-col bg-light-base dark:bg-dark-base border-r border-light-border dark:border-dark-border z-50 transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="font-bold text-dark-base dark:text-white text-base tracking-tight">
              Quantum<span className="text-red-primary">Vest</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-dark-base dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <NavContent />
      </aside>
    </>
  )
}
