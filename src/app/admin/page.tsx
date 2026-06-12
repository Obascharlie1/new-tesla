'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Loader2 } from 'lucide-react'

interface Profile {
  id:           string
  full_name:    string
  email:        string
  balance:      number
  profit:       number
  plan:         string
  kyc_status:   string
  is_suspended: boolean
  created_at:   string
}

interface Tx {
  id:      string
  user_id: string
  status:  string
}

function kycBadge(s: string) {
  if (s === 'Verified') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
  if (s === 'Pending')  return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
  return 'bg-slate-100 text-slate-500 dark:bg-dark-border dark:text-slate-400'
}

export default function AdminUsersListPage() {
  const [users,    setUsers]    = useState<Profile[]>([])
  const [txs,      setTxs]      = useState<Tx[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    async function load() {
      const [usersRes, txsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/transactions'),
      ])

      if (!usersRes.ok) {
        setError('Failed to load users.')
        setLoading(false)
        return
      }

      const { data: usersData } = await usersRes.json()
      const { data: txsData }   = txsRes.ok ? await txsRes.json() : { data: [] }

      setUsers(usersData ?? [])
      setTxs(txsData   ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-orange-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-orange-primary">{error}</p>
      </div>
    )
  }

  const totalPending = txs.filter(t => t.status === 'Pending').length

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-dark-base dark:text-white">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{users.length} accounts</p>
        </div>
        {totalPending > 0 && (
          <span className="text-xs font-bold px-3 py-1.5 bg-amber-400/15 text-amber-700 dark:text-amber-400">
            {totalPending} pending transaction{totalPending > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* User list */}
      <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl divide-y divide-light-border dark:divide-dark-border">
        {users.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No users yet.</p>
          </div>
        )}
        {users.map(user => {
          const userPending = txs.filter(t => t.user_id === user.id && t.status === 'Pending').length
          const initials    = user.full_name
            ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            : user.email.slice(0, 2).toUpperCase()

          return (
            <Link
              key={user.id}
              href={`/admin/users/${user.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-orange-primary/10 flex items-center justify-center flex-shrink-0 text-orange-primary font-bold text-sm">
                {initials}
              </div>

              {/* Name + email */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-dark-base dark:text-white">
                    {user.full_name || user.email}
                  </p>
                  {user.is_suspended && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-primary/10 text-orange-primary uppercase tracking-wider">
                      Suspended
                    </span>
                  )}
                  {userPending > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-400/15 text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {userPending} pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.email}</p>
              </div>

              {/* Balance */}
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-sm font-bold text-dark-base dark:text-white">
                  ${(user.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.plan} plan</p>
              </div>

              {/* KYC */}
              <span className={`hidden md:inline-flex text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider flex-shrink-0 ${kycBadge(user.kyc_status)}`}>
                KYC {user.kyc_status}
              </span>

              {/* Arrow */}
              <ChevronRight size={16} className="text-slate-400 group-hover:text-orange-primary transition-colors flex-shrink-0" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
