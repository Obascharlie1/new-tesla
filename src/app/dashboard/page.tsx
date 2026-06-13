'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowDownToLine, ArrowUpFromLine, TrendingUp, ArrowUpRight,
  History, Loader2, Wallet, Zap, ShieldCheck,
} from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'
import { LandingBTCChart } from '@/components/sections/LandingBTCChart'
import { createClient } from '@/lib/supabase/client'
import { useDashTheme } from '@/components/dashboard/DashboardThemeContext'

interface Profile {
  full_name: string
  balance: number
  profit: number
  plan: string
  kyc_status: string
}

interface Tx {
  id: string
  type: string
  amount: number
  method: string
  status: string
  created_at: string
}

const timeRanges = ['1D', '1W', '1M', '3M', '1Y', 'ALL']

function statusClasses(status: string) {
  if (status === 'Completed') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
  if (status === 'Pending')   return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
  if (status === 'Rejected')  return 'bg-brand-primary/10 text-brand-primary'
  return 'bg-slate-100 text-slate-600 dark:bg-dark-border dark:text-slate-400'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function tierLabel(balance: number) {
  if (balance >= 50000) return 'Platinum'
  if (balance >= 10000) return 'Gold'
  if (balance >= 1000)  return 'Silver'
  return 'Bronze'
}

// Theme token sets
const THEMES = {
  red: {
    card:        'bg-[linear-gradient(135deg,#0b0b0b_0%,#2a0a08_42%,#6e1f12_78%,#a85a12_100%)]',
    deposit:     'bg-brand-primary hover:bg-brand-dim border-brand-primary text-white',
    plans:       'bg-gradient-to-r from-brand-primary to-brand-dim hover:opacity-90',
    stocks:      'text-brand-primary',
    kyc:         'bg-brand-primary/10 border-brand-primary/40 text-brand-primary',
    withdraw:    'bg-[#1a0505] border-brand-primary/20 text-white hover:border-brand-primary/50',
  },
  classic: {
    card:        'bg-[linear-gradient(135deg,#0a0e1a_0%,#0f1829_42%,#162340_78%,#1a2e52_100%)]',
    deposit:     'bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white',
    plans:       'bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90',
    stocks:      'text-blue-400',
    kyc:         'bg-amber-500/10 border-amber-500/40 text-amber-400',
    withdraw:    'bg-[#0d1424] border-white/10 text-white hover:border-white/20',
  },
} as const

export default function DashboardPage() {
  const [profile,      setProfile]      = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [loading,      setLoading]      = useState(true)
  const [activeRange,  setActiveRange]  = useState('1M')

  const { theme } = useDashTheme()
  const T = THEMES[theme]

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: prof }, { data: txs }] = await Promise.all([
        supabase.from('profiles').select('full_name, balance, profit, plan, kyc_status').eq('id', user.id).single(),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(6),
      ])

      setProfile(prof)
      setTransactions(txs ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const balance        = profile?.balance ?? 0
  const profit         = profile?.profit  ?? 0
  const totalDeposited = transactions
    .filter(t => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((s, t) => s + t.amount, 0)

  const chartData = Array.from({ length: 40 }, (_, i) =>
    Math.round(balance * (0.2 + (0.8 * i) / 39) + Math.sin(i * 0.5) * balance * 0.02)
  )

  function buildPaths(data: number[]) {
    const w = 600, h = 160, pad = 8
    const min = Math.min(...data), max = Math.max(...data)
    const range = max - min || 1
    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: pad + ((max - v) / range) * (h - pad * 2),
    }))
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
    const area = `${line} L${pts.at(-1)!.x.toFixed(1)},${h} L0,${h} Z`
    return { line, area }
  }

  const { line, area } = buildPaths(chartData)

  if (loading) {
    return (
      <div>
        <TopBar title="Dashboard" subtitle="Loading…" />
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin text-brand-primary" />
        </div>
      </div>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const tier      = tierLabel(balance)

  return (
    <div>
      <TopBar title="Dashboard" subtitle={`Hi, ${firstName}`} verified={profile?.kyc_status === 'Verified'} />

      <div className="p-4 sm:p-6 max-w-lg mx-auto sm:max-w-6xl space-y-4">

        {/* Greeting */}
        <div>
          <p className="text-2xl sm:text-3xl font-black text-dark-base dark:text-white">
            Welcome back, {firstName}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's your portfolio performance today.
          </p>
        </div>

        {/* KYC pill */}
        {profile?.kyc_status === 'None' && (
          <Link
            href="/dashboard/kyc"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors ${T.kyc}`}
          >
            <ShieldCheck size={15} />
            Complete KYC Verification
          </Link>
        )}

        {/* Total Equity card */}
        <div className={`rounded-2xl p-5 sm:p-6 shadow-xl ${T.card}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet size={15} className="text-white/50" />
              <span className="text-sm font-semibold text-white/60">Total Equity</span>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/20 text-amber-300 text-xs font-bold">
              <Zap size={11} />
              {tier} Tier
            </span>
          </div>

          {/* Balance */}
          <p className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-5">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>

          {/* Stats row */}
          <div className="border-t border-white/10 pt-4 grid grid-cols-3 gap-2">
            <div>
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">PROFIT</p>
              <p className="text-sm font-bold text-emerald-400">+${profit.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">DEPOSITS</p>
              <p className="text-sm font-bold text-white">${totalDeposited.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">STOCKS</p>
              <p className={`text-sm font-bold ${T.stocks}`}>$0</p>
            </div>
          </div>
        </div>

        {/* Deposit / Withdraw */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard/deposit"
            className={`flex flex-col items-center justify-center gap-2.5 rounded-2xl py-9 text-sm font-bold border transition-colors ${T.deposit}`}
          >
            <ArrowDownToLine size={26} />
            <span>Deposit</span>
          </Link>
          <Link
            href="/dashboard/withdraw"
            className={`flex flex-col items-center justify-center gap-2.5 rounded-2xl py-9 text-sm font-bold border transition-colors ${T.withdraw}`}
          >
            <ArrowUpFromLine size={26} />
            <span>Withdraw</span>
          </Link>
        </div>

        {/* Plans full-width button */}
        <Link
          href="/dashboard/plans"
          className={`flex items-center justify-center gap-2.5 w-full rounded-2xl py-5 text-sm font-bold text-white transition-opacity ${T.plans}`}
        >
          <TrendingUp size={22} />
          <span>View Investment Plans</span>
        </Link>

        {/* Quick links row */}
        <div className="flex gap-3">
          <Link
            href="/dashboard/transactions"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 border border-light-border dark:border-dark-border text-xs font-semibold text-dark-base dark:text-white hover:border-brand-primary hover:text-brand-primary transition-colors"
          >
            <History size={14} /><span>History</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 border border-light-border dark:border-dark-border text-xs font-semibold text-dark-base dark:text-white hover:border-brand-primary hover:text-brand-primary transition-colors"
          >
            <ArrowUpRight size={14} /><span>Profile</span>
          </Link>
        </div>

        {/* BTC live chart */}
        <div className="rounded-xl overflow-hidden">
          <LandingBTCChart />
        </div>

        {/* Portfolio chart */}
        {balance > 0 && (
          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="text-sm font-bold text-dark-base dark:text-white">Portfolio Performance</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Balance growth</p>
              </div>
              <div className="flex gap-1">
                {timeRanges.map(r => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={`px-2 py-1 text-[11px] font-semibold transition-colors ${activeRange === r ? 'bg-brand-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 600 160" className="w-full" style={{ height: 160 }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E0241C" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#E0241C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#dashGrad)" />
              <path d={line} fill="none" stroke="#E0241C" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Recent transactions */}
        <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-light-border dark:border-dark-border">
            <h2 className="text-sm font-bold text-dark-base dark:text-white">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-xs font-semibold text-brand-primary hover:text-brand-dim transition-colors">View all</Link>
          </div>

          {transactions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">No transactions yet.</p>
              <Link href="/dashboard/deposit" className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-brand-primary hover:text-brand-dim transition-colors">
                Make your first deposit <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                      {['Type', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-border dark:divide-dark-border">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-dark-base dark:text-white">{tx.type}</td>
                        <td className={`px-6 py-4 text-sm font-semibold ${tx.type === 'Withdrawal' ? 'text-brand-primary' : 'text-dark-base dark:text-white'}`}>
                          {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{tx.method}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{formatDate(tx.created_at)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClasses(tx.status)}`}>{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="sm:hidden divide-y divide-light-border dark:divide-dark-border">
                {transactions.map(tx => (
                  <div key={tx.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-dark-base dark:text-white">{tx.type}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tx.method} · {formatDate(tx.created_at)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-semibold ${tx.type === 'Withdrawal' ? 'text-brand-primary' : 'text-dark-base dark:text-white'}`}>
                        {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                      </p>
                      <span className={`inline-flex mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClasses(tx.status)}`}>{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
