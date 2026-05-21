'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Edit2, Check, X,
  UserX, UserCheck, Trash2,
  CheckCircle, XCircle, Plus,
  ShieldCheck, ShieldAlert, ShieldOff,
  FileText, Loader2,
} from 'lucide-react'

/* ─── types ─────────────────────────────────────────────────────────────── */

interface Profile {
  id:              string
  full_name:       string
  email:           string
  country:         string
  plan:            string
  balance:         number
  profit:          number
  kyc_status:      string
  kyc_doc_type:    string | null
  kyc_submitted_at: string | null
  is_suspended:    boolean
  created_at:      string
}

interface Tx {
  id:         string
  user_id:    string
  type:       string
  amount:     number
  method:     string
  status:     string
  note:       string | null
  created_at: string
}

/* ─── helpers ────────────────────────────────────────────────────────────── */

function statusPill(s: string) {
  if (s === 'Completed') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
  if (s === 'Pending')   return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
  if (s === 'Rejected')  return 'bg-red-primary/10 text-red-primary'
  return ''
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const DEPOSIT_METHODS = ['Bank Transfer', 'Wire Transfer', 'Bitcoin', 'PayPal', 'Manual Credit']

/* ─── page ──────────────────────────────────────────────────────────────── */

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [profile,      setProfile]      = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')

  /* edit state */
  const [editingBal,    setEditingBal]    = useState(false)
  const [balInput,      setBalInput]      = useState('')
  const [savingBal,     setSavingBal]     = useState(false)
  const [editingProfit, setEditingProfit] = useState(false)
  const [profitInput,   setProfitInput]   = useState('')
  const [savingProfit,  setSavingProfit]  = useState(false)

  /* transaction state */
  const [txFilter,    setTxFilter]    = useState<'All' | 'Deposit' | 'Withdrawal' | 'Pending'>('All')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addAmount,   setAddAmount]   = useState('')
  const [addMethod,   setAddMethod]   = useState('Bank Transfer')
  const [addNote,     setAddNote]     = useState('')
  const [addLoading,  setAddLoading]  = useState(false)

  /* action state */
  const [suspending,  setSuspending]  = useState(false)
  const [confirmDel,  setConfirmDel]  = useState(false)
  const [deleting,    setDeleting]    = useState(false)
  const [txLoading,   setTxLoading]   = useState<string | null>(null) // txId being approved/rejected

  /* ── load data ────────────────────────────────────────────────────────── */

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/users/${userId}`)
    if (!res.ok) {
      setError('User not found.')
      setLoading(false)
      return
    }
    const { data } = await res.json()
    setProfile(data.profile)
    setTransactions(data.transactions ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  /* ── mutations ────────────────────────────────────────────────────────── */

  async function patchProfile(updates: Record<string, unknown>) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json?.error ?? 'Update failed')
      return false
    }
    setProfile(json.data)
    return true
  }

  async function saveBalance() {
    const v = parseFloat(balInput)
    if (isNaN(v) || v < 0) { setEditingBal(false); return }
    setSavingBal(true)
    await patchProfile({ balance: v })
    setSavingBal(false)
    setEditingBal(false)
  }

  async function saveProfit() {
    const v = parseFloat(profitInput)
    if (isNaN(v) || v < 0) { setEditingProfit(false); return }
    setSavingProfit(true)
    const ok = await patchProfile({ profit: v })
    if (ok) await load()   // re-fetch from DB so balance reflects the new value
    setSavingProfit(false)
    setEditingProfit(false)
  }

  async function handleSuspend() {
    if (!profile) return
    setSuspending(true)
    await patchProfile({ is_suspended: !profile.is_suspended })
    setSuspending(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin')
    } else {
      setDeleting(false)
      setConfirmDel(false)
    }
  }

  async function handleTxAction(txId: string, status: 'Completed' | 'Rejected') {
    setTxLoading(txId)
    const res = await fetch(`/api/admin/transactions/${txId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      // Refresh profile + transactions
      await load()
    }
    setTxLoading(null)
  }

  async function handleAddDeposit(e: React.FormEvent) {
    e.preventDefault()
    const amt = parseFloat(addAmount)
    if (isNaN(amt) || amt <= 0) return
    setAddLoading(true)

    const res = await fetch('/api/admin/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount: amt, method: addMethod, note: addNote || null }),
    })

    if (res.ok) {
      setAddAmount('')
      setAddNote('')
      setShowAddForm(false)
      await load()
    }
    setAddLoading(false)
  }

  /* ── render ────────────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-red-primary" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{error || 'User not found.'}</p>
        <Link href="/admin" className="flex items-center gap-1.5 text-sm text-red-primary hover:underline w-fit">
          <ArrowLeft size={14} /> Back to users
        </Link>
      </div>
    )
  }

  const userTxs    = transactions
  const filteredTxs = userTxs.filter(t => {
    if (txFilter === 'All')        return true
    if (txFilter === 'Pending')    return t.status === 'Pending'
    if (txFilter === 'Deposit')    return t.type   === 'Deposit'
    if (txFilter === 'Withdrawal') return t.type   === 'Withdrawal'
    return true
  })
  const pendingCount = userTxs.filter(t => t.status === 'Pending').length
  const totalDeposited = userTxs.filter(t => t.type === 'Deposit' && t.status === 'Completed').reduce((s, t) => s + t.amount, 0)

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : profile.email.slice(0, 2).toUpperCase()

  /* ── KYC section ─────────────────────────────────────────────────────── */
  function kycContent() {
    if (!profile) return null
    if (profile.kyc_status === 'None') {
      return (
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 bg-slate-100 dark:bg-dark-border flex items-center justify-center flex-shrink-0">
            <ShieldOff size={18} className="text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-dark-base dark:text-white">No documents submitted</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">The user has not uploaded any identity documents yet.</p>
          </div>
        </div>
      )
    }

    const isVerified = profile.kyc_status === 'Verified'
    return (
      <div className="flex items-start gap-3 py-2">
        <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${isVerified ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
          {isVerified
            ? <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
            : <ShieldAlert size={18} className="text-amber-600 dark:text-amber-400" />
          }
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-dark-base dark:text-white">{profile.kyc_doc_type}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
              isVerified
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
            }`}>
              {profile.kyc_status}
            </span>
          </div>
          {profile.kyc_submitted_at && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Submitted {formatDate(profile.kyc_submitted_at)}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-2 p-2.5 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
              <FileText size={14} className="text-slate-400 flex-shrink-0" />
              <span className="text-xs text-dark-base dark:text-white font-medium">
                {profile.kyc_doc_type}{profile.kyc_doc_type !== 'Passport' ? ' — front + back' : ' — scan'}
              </span>
            </div>
          </div>
          {/* Change KYC status */}
          {!isVerified && (
            <button
              onClick={() => patchProfile({ kyc_status: 'Verified' })}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              <ShieldCheck size={13} /> Mark as Verified
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 pb-16">

      {/* Back */}
      <Link href="/admin" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-dark-base dark:hover:text-white transition-colors w-fit">
        <ArrowLeft size={14} /> Back to users
      </Link>

      {/* ── User header ────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className="w-14 h-14 bg-red-primary/10 flex items-center justify-center flex-shrink-0 text-red-primary font-bold text-lg">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-dark-base dark:text-white">{profile.full_name || profile.email}</h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
              profile.is_suspended
                ? 'bg-red-primary/10 text-red-primary'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
            }`}>
              {profile.is_suspended ? 'Suspended' : 'Active'}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {profile.email}{profile.country ? ` · ${profile.country}` : ''} · Joined {formatDate(profile.created_at)}
          </p>
        </div>
        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleSuspend}
            disabled={suspending}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border transition-colors disabled:opacity-50 ${
              profile.is_suspended
                ? 'border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                : 'border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
            }`}
          >
            {suspending
              ? <Loader2 size={13} className="animate-spin" />
              : profile.is_suspended
              ? <><UserCheck size={13} /> Activate</>
              : <><UserX size={13} /> Suspend</>
            }
          </button>
          <button
            onClick={() => setConfirmDel(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* ── Section 1: Details & Balance ───────────────────────────────── */}
      <section className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border">
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border">
          <h2 className="text-sm font-bold text-dark-base dark:text-white">Details &amp; Balance</h2>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">

          {/* Balance — editable */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Balance</p>
              {!editingBal && (
                <button onClick={() => { setEditingBal(true); setBalInput(String(profile.balance)) }}
                  className="text-slate-400 hover:text-red-primary transition-colors" title="Edit balance">
                  <Edit2 size={13} />
                </button>
              )}
            </div>
            {editingBal ? (
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input type="number" value={balInput} onChange={e => setBalInput(e.target.value)} min="0" autoFocus
                    className="w-full pl-7 pr-3 py-2.5 border border-red-primary bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-lg font-bold focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveBalance} disabled={savingBal}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-primary hover:bg-red-dim disabled:opacity-60 text-white text-xs font-bold transition-colors">
                    {savingBal ? <Loader2 size={12} className="animate-spin" /> : <><Check size={12} /> Save</>}
                  </button>
                  <button onClick={() => setEditingBal(false)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 border border-light-border dark:border-dark-border text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-3xl font-bold text-dark-base dark:text-white">
                ${(profile.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Profit — editable */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profit</p>
              {!editingProfit && (
                <button onClick={() => { setEditingProfit(true); setProfitInput(String(profile.profit)) }}
                  className="text-slate-400 hover:text-red-primary transition-colors" title="Edit profit">
                  <Edit2 size={13} />
                </button>
              )}
            </div>
            {editingProfit ? (
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input type="number" value={profitInput} onChange={e => setProfitInput(e.target.value)} min="0" autoFocus
                    className="w-full pl-7 pr-3 py-2.5 border border-red-primary bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-lg font-bold focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveProfit} disabled={savingProfit}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-primary hover:bg-red-dim disabled:opacity-60 text-white text-xs font-bold transition-colors">
                    {savingProfit ? <Loader2 size={12} className="animate-spin" /> : <><Check size={12} /> Save</>}
                  </button>
                  <button onClick={() => setEditingProfit(false)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 border border-light-border dark:border-dark-border text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                +${(profile.profit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Total deposited — read-only */}
          <div>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Total Deposited</p>
            <p className="text-3xl font-bold text-dark-base dark:text-white">
              ${totalDeposited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{profile.plan} plan</p>
          </div>

        </div>
      </section>

      {/* ── Section 2: KYC ─────────────────────────────────────────────── */}
      <section className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border">
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border">
          <h2 className="text-sm font-bold text-dark-base dark:text-white">KYC Verification</h2>
        </div>
        <div className="px-5 py-4">
          {kycContent()}
        </div>
      </section>

      {/* ── Section 3: Transactions ─────────────────────────────────────── */}
      <section className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border">
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border flex items-center gap-3 flex-wrap">
          <div>
            <h2 className="text-sm font-bold text-dark-base dark:text-white">Transactions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {userTxs.length} total{pendingCount > 0 ? ` · ${pendingCount} pending` : ''}
            </p>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => { setShowAddForm(v => !v); setTxFilter('All') }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-red-primary hover:bg-red-dim text-white transition-colors"
            >
              <Plus size={13} /> Add Deposit
            </button>
          </div>
        </div>

        {/* Add deposit form */}
        {showAddForm && (
          <form onSubmit={handleAddDeposit} className="px-5 py-4 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface space-y-3">
            <p className="text-xs font-bold text-dark-base dark:text-white uppercase tracking-wider">New Deposit</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input type="number" value={addAmount} onChange={e => setAddAmount(e.target.value)} placeholder="0.00" min="1" step="0.01" required
                    className="w-full pl-7 pr-3 py-2.5 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-sm font-semibold focus:outline-none focus:border-red-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Method</label>
                <select value={addMethod} onChange={e => setAddMethod(e.target.value)}
                  className="w-full px-3 py-2.5 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-sm focus:outline-none focus:border-red-primary transition-colors">
                  {DEPOSIT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Note <span className="normal-case font-normal">(optional)</span></label>
                <input type="text" value={addNote} onChange={e => setAddNote(e.target.value)} placeholder="e.g. Manual credit"
                  className="w-full px-3 py-2.5 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-sm focus:outline-none focus:border-red-primary transition-colors placeholder:text-slate-400" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={addLoading || !addAmount}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-red-primary hover:bg-red-dim disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors">
                {addLoading
                  ? <Loader2 size={13} className="animate-spin" />
                  : <><Check size={13} /> Credit Balance</>
                }
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 border border-light-border dark:border-dark-border text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Filter tabs */}
        <div className="px-5 py-3 border-b border-light-border dark:border-dark-border flex gap-1.5 flex-wrap">
          {(['All', 'Deposit', 'Withdrawal', 'Pending'] as const).map(f => (
            <button key={f} onClick={() => setTxFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                txFilter === f
                  ? 'bg-red-primary text-white'
                  : 'border border-light-border dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-red-primary hover:text-red-primary'
              }`}
            >
              {f}
              {f === 'Pending' && pendingCount > 0 && (
                <span className={`ml-1.5 px-1 text-[9px] font-bold ${txFilter === f ? 'opacity-80' : 'text-amber-600 dark:text-amber-400'}`}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Transaction table */}
        {filteredTxs.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No transactions</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-light-border dark:divide-dark-border">
                    {['Date', 'Type', 'Amount', 'Method', 'Note', 'Status', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border">
                  {filteredTxs.map(tx => (
                    <tr key={tx.id} className="hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                      <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDate(tx.created_at)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-sm font-semibold ${tx.type === 'Deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-primary'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-dark-base dark:text-white whitespace-nowrap">
                        {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400">{tx.method}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">{tx.note || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusPill(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {tx.status === 'Pending' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleTxAction(tx.id, 'Completed')}
                              disabled={txLoading === tx.id}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                              {txLoading === tx.id ? <Loader2 size={12} className="animate-spin" /> : <><CheckCircle size={12} /> Approve</>}
                            </button>
                            <button
                              onClick={() => handleTxAction(tx.id, 'Rejected')}
                              disabled={txLoading === tx.id}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-primary/10 text-red-primary text-xs font-semibold hover:bg-red-primary/20 transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="sm:hidden divide-y divide-light-border dark:divide-dark-border">
              {filteredTxs.map(tx => (
                <div key={tx.id} className="px-5 py-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-sm font-semibold ${tx.type === 'Deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-primary'}`}>
                        {tx.type}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 mx-2">·</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{tx.method}</span>
                    </div>
                    <p className="text-sm font-bold text-dark-base dark:text-white">
                      {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(tx.created_at)}{tx.note ? ` · ${tx.note}` : ''}</p>
                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusPill(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                  {tx.status === 'Pending' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleTxAction(tx.id, 'Completed')}
                        disabled={txLoading === tx.id}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                      >
                        {txLoading === tx.id ? <Loader2 size={12} className="animate-spin" /> : <><CheckCircle size={12} /> Approve</>}
                      </button>
                      <button
                        onClick={() => handleTxAction(tx.id, 'Rejected')}
                        disabled={txLoading === tx.id}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-primary/10 text-red-primary text-xs font-semibold hover:bg-red-primary/20 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Delete confirmation modal */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border p-6 max-w-sm w-full">
            <h3 className="text-base font-bold text-dark-base dark:text-white mb-2">
              Delete {profile.full_name || profile.email}?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              This will permanently remove the account and all transaction history. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDel(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border border-light-border dark:border-dark-border text-sm font-semibold text-dark-base dark:text-white hover:bg-light-surface dark:hover:bg-dark-surface transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-primary hover:bg-red-dim disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
