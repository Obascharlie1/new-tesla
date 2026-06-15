'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowDownToLine, ArrowUpFromLine, TrendingUp, ArrowUpRight,
  History, Loader2, MessageSquare, User, MoreHorizontal, ShieldAlert, X, BarChart2,
} from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'
import { LandingBTCChart } from '@/components/sections/LandingBTCChart'
import { createClient } from '@/lib/supabase/client'

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
  if (status === 'Pending')   return 'bg-white/5 text-slate-300 border border-white/10'
  if (status === 'Rejected')  return 'bg-brand-primary/10 text-brand-primary'
  return 'bg-white/5 text-slate-400'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface QuickAction {
  href: string
  icon: React.ReactNode
  label: string
}

interface Holding {
  symbol: string
  name: string
  total_quantity: number
  total_invested: number
  total_profit: number
}

const COLORS: Record<string, string> = {
  TSLA: '#CC0000', SPCX: '#1A1A2E', META: '#1877F2',
  AAPL: '#555555', NVDA: '#76B900', AMZN: '#FF9900',
  MSFT: '#00A4EF', GOOGL: '#4285F4',
}

function groupHoldings(rows: Array<{ symbol: string; name: string; quantity: number; purchase_amount: number; profit?: number }>): Holding[] {
  const map: Record<string, Holding> = {}
  for (const r of rows) {
    if (!map[r.symbol]) map[r.symbol] = { symbol: r.symbol, name: r.name, total_quantity: 0, total_invested: 0, total_profit: 0 }
    map[r.symbol].total_quantity += Number(r.quantity)
    map[r.symbol].total_invested += Number(r.purchase_amount)
    map[r.symbol].total_profit   += Number(r.profit ?? 0)
  }
  return Object.values(map)
}

export default function DashboardPage() {
  const [profile,      setProfile]      = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [loading,      setLoading]      = useState(true)
  const [activeRange,  setActiveRange]  = useState('1M')
  const [kycDismissed, setKycDismissed] = useState(false)
  const [holdings,     setHoldings]     = useState<Holding[]>([])

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

      // Fetch shares holdings separately (non-blocking)
      fetch('/api/shares').then(r => r.json()).then(({ data }) => {
        if (data) setHoldings(groupHoldings(data))
      })
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
          <Loader2 size={24} className="animate-spin text-white/40" />
        </div>
      </div>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  const quickActions: QuickAction[] = [
    { href: '/dashboard/deposit',      icon: <ArrowDownToLine size={20} />, label: 'Deposit'  },
    { href: '/dashboard/withdraw',     icon: <ArrowUpFromLine size={20} />, label: 'Withdraw' },
    { href: '/dashboard/plans',        icon: <TrendingUp      size={20} />, label: 'Plans'    },
    { href: '/dashboard/transactions', icon: <History         size={20} />, label: 'History'  },
    { href: '/dashboard/messages',     icon: <MessageSquare   size={20} />, label: 'Messages' },
    { href: '/dashboard/profile',      icon: <User            size={20} />, label: 'Profile'  },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Page-level background: red radial glow at top + faint grid */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#070707]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-brand-primary/[0.07] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <TopBar title="Dashboard" subtitle={`Hi, ${firstName}`} verified={profile?.kyc_status === 'Verified'} />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">

        {/* KYC banner */}
        {!kycDismissed && profile?.kyc_status === 'None' && (
          <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <ShieldAlert size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Identity verification required</p>
              <p className="text-xs text-slate-400 mt-0.5">Complete KYC to unlock full withdrawal access.</p>
              <Link href="/dashboard/kyc" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-white underline underline-offset-2">
                Verify now <ArrowUpRight size={11} />
              </Link>
            </div>
            <button onClick={() => setKycDismissed(true)} className="text-slate-500 hover:text-white flex-shrink-0 transition-colors">
              <X size={15} />
            </button>
          </div>
        )}

        {/* Hero balance */}
        <div className="relative text-center py-8 overflow-hidden">
          {/* Radial red glow behind the balance number */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-44 bg-brand-primary/10 blur-[70px] rounded-full" />
          </div>
          <div className="relative">
            <p className="text-xs text-slate-500 mb-3 tracking-widest uppercase">Your balance</p>
            <p className="text-5xl sm:text-6xl font-bold text-white tracking-tight mb-1">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {profit > 0 && (
              <p className="text-sm text-emerald-400 mt-2 font-medium">+${profit.toLocaleString()} profit</p>
            )}

            {/* Deposit + Withdraw only */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <Link
                href="/dashboard/deposit"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary text-white text-sm font-bold hover:bg-brand-dim transition-colors"
              >
                <ArrowDownToLine size={15} /> Deposit
              </Link>
              <Link
                href="/dashboard/withdraw"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white text-sm font-bold hover:bg-white/15 border border-white/10 transition-colors"
              >
                <ArrowUpFromLine size={15} /> Withdraw
              </Link>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Deposited',   value: `$${totalDeposited.toLocaleString()}` },
            { label: 'Profit',      value: `+$${profit.toLocaleString()}` },
            { label: 'Active Plan', value: profile?.plan ?? 'None' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/[0.08] rounded-2xl p-4 text-center hover:border-brand-primary/25 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">{s.label}</p>
              <p className="text-sm font-bold text-white truncate">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Buy Shares banner */}
        <Link
          href="/dashboard/shares"
          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-brand-primary/15 to-brand-primary/5 border border-brand-primary/20 hover:border-brand-primary/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
              <BarChart2 size={16} className="text-brand-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Buy Shares</p>
              <p className="text-xs text-slate-400">Tesla, NVIDIA, Apple &amp; more</p>
            </div>
          </div>
          <ArrowUpRight size={15} className="text-slate-500 group-hover:text-brand-primary transition-colors flex-shrink-0" />
        </Link>

        {/* My Shares */}
        {holdings.length > 0 && (
          <div className="bg-white/5 border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <h2 className="text-sm font-bold text-white">My Shares</h2>
              <Link href="/dashboard/shares" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                Trade
              </Link>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {holdings.map(h => {
                const gainPct = h.total_invested > 0
                  ? (h.total_profit / h.total_invested) * 100
                  : 0
                const currentValue = h.total_invested + h.total_profit
                return (
                  <div key={h.symbol} className="flex items-center gap-3 px-5 py-3.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: COLORS[h.symbol] ?? '#333' }}
                    >
                      {h.symbol.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{h.symbol}</p>
                      <p className="text-xs text-slate-500">{h.total_quantity.toFixed(4)} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className={`text-xs font-bold ${gainPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {gainPct >= 0 ? '+' : ''}{gainPct.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* BTC live chart */}
        <div className="rounded-2xl overflow-hidden">
          <LandingBTCChart />
        </div>

        {/* Portfolio chart */}
        {balance > 0 && (
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="text-sm font-bold text-white">Portfolio Performance</h2>
                <p className="text-xs text-slate-500 mt-0.5">Balance growth</p>
              </div>
              <div className="flex gap-1">
                {timeRanges.map(r => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                      activeRange === r
                        ? 'bg-white text-black'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 600 160" className="w-full" style={{ height: 140 }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E0241C" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#E0241C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#dashGrad)" />
              <path d={line} fill="none" stroke="#E0241C" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Recent transactions */}
        <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="text-sm font-bold text-white">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
              View all
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">No transactions yet.</p>
              <Link href="/dashboard/deposit" className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-white hover:text-slate-300 transition-colors">
                Make your first deposit <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/8">
                      {['Type', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-white/3 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-white">{tx.type}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-white">
                          {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">{tx.method}</td>
                        <td className="px-5 py-4 text-sm text-slate-400">{formatDate(tx.created_at)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClasses(tx.status)}`}>{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile */}
              <div className="sm:hidden divide-y divide-white/5">
                {transactions.map(tx => (
                  <div key={tx.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{tx.type}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{tx.method} · {formatDate(tx.created_at)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-white">
                        {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                      </p>
                      <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClasses(tx.status)}`}>{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Manage plan CTA */}
        <Link
          href="/dashboard/plans"
          className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors group"
        >
          <div>
            <p className="text-sm font-bold text-white">
              {profile?.plan && profile.plan !== 'None' ? profile.plan : 'No active plan'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {profile?.plan && profile.plan !== 'None' ? 'Manage your plan' : 'Choose an investment plan'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
            <TrendingUp size={16} />
            <ArrowUpRight size={14} />
          </div>
        </Link>

      </div>
    </div>
  )
}
