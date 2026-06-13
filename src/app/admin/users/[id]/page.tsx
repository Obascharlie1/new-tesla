'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Edit2, Check, X,
  UserX, UserCheck, Trash2,
  CheckCircle, XCircle, Plus,
  ShieldCheck, ShieldAlert, ShieldOff,
  FileText, Loader2, Bell, Send, ZoomIn,
  RotateCcw, MessageCircle,
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
  if (s === 'Rejected')  return 'bg-brand-primary/10 text-brand-primary'
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
  const [suspending,   setSuspending]   = useState(false)
  const [confirmDel,   setConfirmDel]   = useState(false)
  const [deleting,     setDeleting]     = useState(false)
  const [txLoading,    setTxLoading]    = useState<string | null>(null)
  const [confirmTxDel, setConfirmTxDel] = useState<string | null>(null) // txId pending delete confirm
  const [actionError,  setActionError]  = useState('')

  /* kyc docs state */
  const [kycDocs,       setKycDocs]       = useState<{ front?: string; back?: string } | null>(null)
  const [kycDocsLoading, setKycDocsLoading] = useState(false)
  const [lightboxImg,   setLightboxImg]   = useState<string | null>(null)

  /* messaging state */
  const [messages,    setMessages]    = useState<{ id: string; sender: string; content: string; created_at: string }[]>([])
  const [msgInput,    setMsgInput]    = useState('')
  const [msgLoading,  setMsgLoading]  = useState(false)
  const [msgSending,  setMsgSending]  = useState(false)
  const [msgOpen,     setMsgOpen]     = useState(false)
  const msgBottomRef = useRef<HTMLDivElement>(null)

  /* notification state */
  const [notifTitle,   setNotifTitle]   = useState('')
  const [notifMessage, setNotifMessage] = useState('')
  const [notifType,    setNotifType]    = useState<'info' | 'success' | 'warning' | 'error'>('info')
  const [notifLoading, setNotifLoading] = useState(false)
  const [notifSent,    setNotifSent]    = useState(false)

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
    setActionError('')
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const json = await res.json()
    if (!res.ok) {
      setActionError(json?.error ?? 'Update failed. Please try again.')
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
    if (ok) await load()
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

  async function handleTxDelete(txId: string) {
    setTxLoading(txId)
    const res = await fetch(`/api/admin/transactions/${txId}`, { method: 'DELETE' })
    if (res.ok) { setConfirmTxDel(null); await load() }
    setTxLoading(null)
  }

  async function handleTxRevert(txId: string) {
    setTxLoading(txId)
    const res = await fetch(`/api/admin/transactions/${txId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Pending' }),
    })
    if (res.ok) await load()
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

  async function loadMessages() {
    setMsgLoading(true)
    const res = await fetch(`/api/admin/users/${userId}/messages`)
    if (res.ok) {
      const { data } = await res.json()
      setMessages(data ?? [])
    }
    setMsgLoading(false)
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!msgInput.trim()) return
    setMsgSending(true)
    const res = await fetch(`/api/admin/users/${userId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: msgInput.trim() }),
    })
    if (res.ok) {
      const { data } = await res.json()
      setMessages(prev => [...prev, data])
      setMsgInput('')
      setTimeout(() => msgBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
    setMsgSending(false)
  }

  useEffect(() => {
    if (msgOpen) loadMessages()
  }, [msgOpen])

  useEffect(() => {
    if (msgOpen) msgBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, msgOpen])

  async function loadKycDocs() {
    setKycDocsLoading(true)
    const res = await fetch(`/api/admin/users/${userId}/kyc-docs`)
    if (res.ok) {
      const { data } = await res.json()
      setKycDocs(data)
    }
    setKycDocsLoading(false)
  }

  async function handleSendNotification(e: React.FormEvent) {
    e.preventDefault()
    if (!notifTitle.trim() || !notifMessage.trim()) return
    setNotifLoading(true)
    const res = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title: notifTitle, message: notifMessage, type: notifType }),
    })
    setNotifLoading(false)
    if (res.ok) {
      setNotifTitle('')
      setNotifMessage('')
      setNotifType('info')
      setNotifSent(true)
      setTimeout(() => setNotifSent(false), 3000)
    }
  }

  /* ── render ────────────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-brand-primary" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{error || 'User not found.'}</p>
        <Link href="/admin" className="flex items-center gap-1.5 text-sm text-brand-primary hover:underline w-fit">
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
          {/* View documents */}
          <div className="mt-4">
            {!kycDocs && !kycDocsLoading && (
              <button
                onClick={loadKycDocs}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-light-border dark:border-dark-border text-slate-600 dark:text-slate-300 hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                <FileText size={13} /> View Documents
              </button>
            )}
            {kycDocsLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={13} className="animate-spin" /> Loading documents…
              </div>
            )}
            {kycDocs && (
              <div className="space-y-3 mt-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Submitted Documents</p>
                <div className="flex gap-3 flex-wrap">
                  {kycDocs.front && (
                    <div className="relative group cursor-pointer" onClick={() => setLightboxImg(kycDocs.front!)}>
                      <img src={kycDocs.front} alt="Front" className="w-40 h-28 object-cover border border-light-border dark:border-dark-border rounded-lg" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <ZoomIn size={20} className="text-white" />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 text-center">Front</p>
                    </div>
                  )}
                  {kycDocs.back && (
                    <div className="relative group cursor-pointer" onClick={() => setLightboxImg(kycDocs.back!)}>
                      <img src={kycDocs.back} alt="Back" className="w-40 h-28 object-cover border border-light-border dark:border-dark-border rounded-lg" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <ZoomIn size={20} className="text-white" />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 text-center">Back</p>
                    </div>
                  )}
                  {!kycDocs.front && !kycDocs.back && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">No documents found in storage.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Change KYC status */}
          {!isVerified && (
            <button
              onClick={() => patchProfile({ kyc_status: 'Verified' })}
              className="mt-4 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
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
        <div className="w-14 h-14 bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-brand-primary font-bold text-lg">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-dark-base dark:text-white">{profile.full_name || profile.email}</h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
              profile.is_suspended
                ? 'bg-brand-primary/10 text-brand-primary'
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

      {/* Action error */}
      {actionError && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-brand-primary/10 border border-brand-primary/30 text-sm text-brand-primary">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="flex-shrink-0"><X size={14} /></button>
        </div>
      )}

      {/* ── Section 1: Details & Balance ───────────────────────────────── */}
      <section className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border">
          <h2 className="text-sm font-bold text-dark-base dark:text-white">Details &amp; Balance</h2>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">

          {/* Balance — editable */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Balance (Profit)</p>
              {!editingBal && (
                <button onClick={() => { setEditingBal(true); setBalInput(String(profile.balance)) }}
                  className="text-slate-400 hover:text-brand-primary transition-colors" title="Edit balance">
                  <Edit2 size={13} />
                </button>
              )}
            </div>
            {editingBal ? (
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input type="number" value={balInput} onChange={e => setBalInput(e.target.value)} min="0" autoFocus
                    className="w-full pl-7 pr-3 py-2.5 border border-brand-primary bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-lg font-bold focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveBalance} disabled={savingBal}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-brand-primary hover:bg-brand-dim disabled:opacity-60 text-white text-xs font-bold transition-colors">
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
                ${(profile.profit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Profit — editable */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Profit</p>
              {!editingProfit && (
                <button onClick={() => { setEditingProfit(true); setProfitInput(String(profile.profit)) }}
                  className="text-slate-400 hover:text-brand-primary transition-colors" title="Edit profit">
                  <Edit2 size={13} />
                </button>
              )}
            </div>
            {editingProfit ? (
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input type="number" value={profitInput} onChange={e => setProfitInput(e.target.value)} min="0" autoFocus
                    className="w-full pl-7 pr-3 py-2.5 border border-brand-primary bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-lg font-bold focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveProfit} disabled={savingProfit}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-brand-primary hover:bg-brand-dim disabled:opacity-60 text-white text-xs font-bold transition-colors">
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
      <section className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border">
          <h2 className="text-sm font-bold text-dark-base dark:text-white">KYC Verification</h2>
        </div>
        <div className="px-5 py-4">
          {kycContent()}
        </div>
      </section>

      {/* ── Section 3: Transactions ─────────────────────────────────────── */}
      <section className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
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
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-brand-primary hover:bg-brand-dim text-white transition-colors"
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
                    className="w-full pl-7 pr-3 py-2.5 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-sm font-semibold focus:outline-none focus:border-brand-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Method</label>
                <select value={addMethod} onChange={e => setAddMethod(e.target.value)}
                  className="w-full px-3 py-2.5 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors">
                  {DEPOSIT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Note <span className="normal-case font-normal">(optional)</span></label>
                <input type="text" value={addNote} onChange={e => setAddNote(e.target.value)} placeholder="e.g. Manual credit"
                  className="w-full px-3 py-2.5 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors placeholder:text-slate-400" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={addLoading || !addAmount}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary hover:bg-brand-dim disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors">
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
                  ? 'bg-brand-primary text-white'
                  : 'border border-light-border dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-brand-primary hover:text-brand-primary'
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
                        <span className={`text-sm font-semibold ${tx.type === 'Deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-primary'}`}>
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
                        <div className="flex gap-1.5 flex-wrap">
                          {tx.status === 'Pending' && (
                            <>
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
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-primary/10 text-brand-primary text-xs font-semibold hover:bg-brand-primary/20 transition-colors whitespace-nowrap disabled:opacity-50"
                              >
                                <XCircle size={12} /> Reject
                              </button>
                            </>
                          )}
                          {tx.status === 'Completed' && tx.type === 'Deposit' && (
                            <button
                              onClick={() => handleTxRevert(tx.id)}
                              disabled={txLoading === tx.id}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                              {txLoading === tx.id ? <Loader2 size={12} className="animate-spin" /> : <><RotateCcw size={12} /> Pending</>}
                            </button>
                          )}
                          {confirmTxDel === tx.id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleTxDelete(tx.id)}
                                disabled={txLoading === tx.id}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-dim transition-colors whitespace-nowrap disabled:opacity-50"
                              >
                                {txLoading === tx.id ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
                              </button>
                              <button onClick={() => setConfirmTxDel(null)} className="px-2 py-1.5 border border-light-border dark:border-dark-border text-xs text-slate-500 hover:bg-light-surface dark:hover:bg-dark-surface">
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmTxDel(tx.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          )}
                        </div>
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
                      <span className={`text-sm font-semibold ${tx.type === 'Deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-primary'}`}>
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
                  <div className="flex gap-2 pt-1 flex-wrap">
                    {tx.status === 'Pending' && (
                      <>
                        <button onClick={() => handleTxAction(tx.id, 'Completed')} disabled={txLoading === tx.id}
                          className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50">
                          {txLoading === tx.id ? <Loader2 size={12} className="animate-spin" /> : <><CheckCircle size={12} /> Approve</>}
                        </button>
                        <button onClick={() => handleTxAction(tx.id, 'Rejected')} disabled={txLoading === tx.id}
                          className="flex-1 flex items-center justify-center gap-1 py-2 bg-brand-primary/10 text-brand-primary text-xs font-semibold hover:bg-brand-primary/20 transition-colors disabled:opacity-50">
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    )}
                    {tx.status === 'Completed' && tx.type === 'Deposit' && (
                      <button onClick={() => handleTxRevert(tx.id)} disabled={txLoading === tx.id}
                        className="flex items-center gap-1 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-semibold hover:bg-amber-100 transition-colors disabled:opacity-50">
                        <RotateCcw size={12} /> Set Pending
                      </button>
                    )}
                    {confirmTxDel === tx.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleTxDelete(tx.id)} disabled={txLoading === tx.id}
                          className="flex items-center gap-1 px-3 py-2 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-dim transition-colors disabled:opacity-50">
                          {txLoading === tx.id ? <Loader2 size={12} className="animate-spin" /> : 'Confirm Delete'}
                        </button>
                        <button onClick={() => setConfirmTxDel(null)} className="px-2 py-2 border border-light-border dark:border-dark-border text-xs text-slate-500">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmTxDel(tx.id)}
                        className="flex items-center gap-1 px-3 py-2 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Section 4: Messages ────────────────────────────────────────── */}
      <section className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
        <button
          onClick={() => setMsgOpen(v => !v)}
          className="w-full px-5 py-4 flex items-center gap-2 border-b border-light-border dark:border-dark-border"
        >
          <MessageCircle size={15} className="text-brand-primary" />
          <h2 className="text-sm font-bold text-dark-base dark:text-white">Messages</h2>
          <span className="ml-auto text-xs text-slate-500">{msgOpen ? '▲ Hide' : '▼ Open chat'}</span>
        </button>

        {msgOpen && (
          <div className="flex flex-col h-96">
            {/* Message thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgLoading ? (
                <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-brand-primary" /></div>
              ) : messages.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-8">No messages yet. Start the conversation below.</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.sender === 'admin'
                        ? 'bg-brand-primary text-white rounded-br-sm'
                        : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-dark-base dark:text-white rounded-bl-sm'
                    }`}>
                      {msg.sender === 'user' && (
                        <p className="text-[10px] font-bold text-brand-primary mb-1 uppercase tracking-wider">{profile.full_name || 'User'}</p>
                      )}
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === 'admin' ? 'text-white/60' : 'text-slate-400'}`}>
                        {new Date(msg.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={msgBottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-light-border dark:border-dark-border p-3 flex gap-2">
              <input
                type="text"
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-3 py-2 border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-sm text-dark-base dark:text-white focus:outline-none focus:border-brand-primary transition-colors rounded-lg placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!msgInput.trim() || msgSending}
                className="h-9 px-4 flex items-center gap-1.5 bg-brand-primary hover:bg-brand-dim disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0"
              >
                {msgSending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                <span>{msgSending ? 'Sending…' : 'Send'}</span>
              </button>
            </form>
          </div>
        )}
      </section>

      {/* ── Section 6: Send Notification ───────────────────────────────── */}
      <section className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
        <div className="px-5 py-4 border-b border-light-border dark:border-dark-border flex items-center gap-2">
          <Bell size={15} className="text-brand-primary" />
          <h2 className="text-sm font-bold text-dark-base dark:text-white">Send Notification</h2>
        </div>
        <form onSubmit={handleSendNotification} className="p-5 space-y-4">

          {/* Type selector */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Type</label>
            <div className="flex gap-2 flex-wrap">
              {([
                { value: 'info',    label: 'Info',    color: 'text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'    },
                { value: 'success', label: 'Success', color: 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' },
                { value: 'warning', label: 'Warning', color: 'text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20'    },
                { value: 'error',   label: 'Alert',   color: 'text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setNotifType(opt.value)}
                  className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    notifType === opt.value
                      ? opt.color
                      : 'border-light-border dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              value={notifTitle}
              onChange={e => setNotifTitle(e.target.value)}
              placeholder="e.g. Your deposit has been approved"
              required
              className="w-full px-3 py-2.5 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Message</label>
            <textarea
              value={notifMessage}
              onChange={e => setNotifMessage(e.target.value)}
              placeholder="Write the notification message here…"
              required
              rows={3}
              className="w-full px-3 py-2.5 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-sm focus:outline-none focus:border-brand-primary transition-colors placeholder:text-slate-400 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={notifLoading || !notifTitle.trim() || !notifMessage.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary hover:bg-brand-dim disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors"
            >
              {notifLoading
                ? <><Loader2 size={13} className="animate-spin" /> Sending…</>
                : <><Send size={13} /> Send Notification</>
              }
            </button>
            {notifSent && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={13} /> Notification sent!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Document lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightboxImg} alt="KYC Document" className="w-full rounded-xl max-h-[80vh] object-contain" />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black flex items-center justify-center text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 max-w-sm w-full">
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
                className="flex-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-dim disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
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
