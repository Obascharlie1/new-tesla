'use client'

import Image from 'next/image'
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
  MessageCircle,
  BarChart2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard',              label: 'Dashboard',    icon: LayoutDashboard, exact: true },
  { href: '/dashboard/deposit',      label: 'Deposit',      icon: ArrowDownToLine },
  { href: '/dashboard/withdraw',     label: 'Withdraw',     icon: ArrowUpFromLine },
  { href: '/dashboard/plans',        label: 'My Plans',     icon: TrendingUp },
  { href: '/dashboard/shares',       label: 'Buy Shares',   icon: BarChart2 },
  { href: '/dashboard/transactions', label: 'Transactions', icon: History },
  { href: '/dashboard/messages',     label: 'Messages',     icon: MessageCircle },
  { href: '/dashboard/profile',      label: 'Profile',      icon: User },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const [userName,    setUserName]    = useState('')
  const [userEmail,   setUserEmail]   = useState('')
  const [unreadMsgs,  setUnreadMsgs]  = useState(0)

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

  // Poll for unread messages
  const fetchUnread = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('sender', 'admin')
      .eq('read', false)
    setUnreadMsgs(count ?? 0)
  }, [])

  useEffect(() => {
    fetchUnread()
    const id = setInterval(fetchUnread, 15_000)
    return () => clearInterval(id)
  }, [fetchUnread])

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
          const isMessages = item.href === '/dashboard/messages'
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-white/10 text-white border-l-2 border-white pl-[10px]'
                  : 'text-[#666] hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              )}
            >
              <item.icon size={17} strokeWidth={active ? 2.5 : 2} />
              <span className="flex-1">{item.label}</span>
              {isMessages && unreadMsgs > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-white text-black text-[10px] font-bold">
                  {unreadMsgs}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/[0.08] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#1A1A1A] border border-white/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {userName ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '…'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName || 'Loading…'}</p>
            <p className="text-xs text-[#555] truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-[#555] hover:text-white transition-colors"
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
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col bg-[#0A0A0A] border-r border-white/[0.08] z-40">
        {/* Logo */}
        <div className="flex items-center px-6 py-5 border-b border-white/[0.08]">
          <Image src="/images/logo.png" alt="Tesla Capital" width={120} height={20} className="h-5 w-auto" />
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
          'lg:hidden fixed left-0 top-0 h-full w-72 flex flex-col bg-[#0A0A0A] border-r border-white/[0.08] z-50 transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.08]">
          <Image src="/images/logo.png" alt="Tesla Capital" width={60} height={10} className="h-2.5 w-auto" />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <NavContent />
      </aside>
    </>
  )
}
