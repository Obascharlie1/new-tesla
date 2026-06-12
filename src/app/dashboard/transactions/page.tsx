'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { Search, Filter, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Tx {
  id: string
  type: string
  amount: number
  method: string
  status: string
  created_at: string
  note?: string | null
}

const filters = ['All', 'Deposits', 'Withdrawals']

function statusClasses(status: string) {
  if (status === 'Completed') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
  if (status === 'Pending')   return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
  if (status === 'Rejected')  return 'bg-orange-primary/10 text-orange-primary'
  return 'bg-slate-100 text-slate-600 dark:bg-dark-border dark:text-slate-400'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setTransactions(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = transactions.filter(tx => {
    const matchesType =
      activeFilter === 'All' ||
      (activeFilter === 'Deposits'    && tx.type === 'Deposit')    ||
      (activeFilter === 'Withdrawals' && tx.type === 'Withdrawal')
    const matchesSearch = !search ||
      tx.method.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      (tx.note ?? '').toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  const totalIn  = transactions.filter(t => t.type === 'Deposit'    && t.status === 'Completed').reduce((s, t) => s + t.amount, 0)
  const totalOut = transactions.filter(t => t.type === 'Withdrawal'  && t.status === 'Completed').reduce((s, t) => s + t.amount, 0)
  const pending  = transactions.filter(t => t.status === 'Pending').length

  if (loading) {
    return (
      <div>
        <TopBar title="Transactions" subtitle="Full history of your account activity" />
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin text-orange-primary" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <TopBar title="Transactions" subtitle="Full history of your account activity" />

      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total In</p>
            <p className="text-base sm:text-lg font-bold text-dark-base dark:text-white">
              +${totalIn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Out</p>
            <p className="text-base sm:text-lg font-bold text-orange-primary">
              -${totalOut.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Pending</p>
            <p className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">{pending}</p>
          </div>
        </div>

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeFilter === f
                    ? 'bg-orange-primary text-white'
                    : 'border border-light-border dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-orange-primary hover:text-orange-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by method, note, or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-primary transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  {['Type', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-dark-base dark:text-white">{tx.type}</td>
                    <td className={`px-5 py-3.5 text-sm font-semibold ${tx.type === 'Withdrawal' ? 'text-orange-primary' : 'text-dark-base dark:text-white'}`}>
                      {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{tx.method}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{formatDate(tx.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClasses(tx.status)}`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden divide-y divide-light-border dark:divide-dark-border">
            {filtered.map((tx) => (
              <div key={tx.id} className="px-4 py-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-dark-base dark:text-white">{tx.type}</p>
                    <span className={`inline-flex px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusClasses(tx.status)}`}>{tx.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tx.method} · {formatDate(tx.created_at)}</p>
                </div>
                <p className={`text-sm font-bold flex-shrink-0 ${tx.type === 'Withdrawal' ? 'text-orange-primary' : 'text-dark-base dark:text-white'}`}>
                  {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Filter size={24} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {transactions.length === 0 ? 'No transactions yet.' : 'No transactions match your filters.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
