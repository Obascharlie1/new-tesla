'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Shield, LogOut } from 'lucide-react'

function TopBar() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-light-base dark:bg-dark-card border-b border-light-border dark:border-dark-border flex items-center px-6 gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-brand-primary flex items-center justify-center flex-shrink-0">
          <Shield size={14} className="text-white" />
        </div>
        <Link href="/admin" className="text-sm font-bold text-dark-base dark:text-white hover:text-brand-primary transition-colors">
          Tesla Capital
        </Link>
        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest px-1.5 py-0.5 border border-brand-primary/30">
          Admin
        </span>
      </div>
      <button
        onClick={logout}
        className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white transition-colors"
      >
        <LogOut size={14} />
        Logout
      </button>
    </header>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin  = pathname === '/admin/login'

  // The middleware handles auth for all /admin/* routes.
  // Login page gets no TopBar; everything else gets the TopBar.
  if (isLogin) {
    return <>{children}</>
  }

  return (
    <>
      <TopBar />
      <div className="pt-14 min-h-screen bg-light-surface dark:bg-dark-surface">
        {children}
      </div>
    </>
  )
}
