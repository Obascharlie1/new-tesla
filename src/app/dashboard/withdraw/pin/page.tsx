'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Delete, Loader2 } from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'

const PIN_LENGTH  = 8
const MASTER_PIN  = '90152313'

interface PendingWithdrawal {
  amount: number
  method: string
  fee: string
  youReceive: string
}

type Phase = 'enter' | 'submitting' | 'success' | 'error'

export default function WithdrawPinPage() {
  const [pin,     setPin]     = useState<number[]>([])
  const [phase,   setPhase]   = useState<Phase>('enter')
  const [shake,   setShake]   = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [pending, setPending] = useState<PendingWithdrawal | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('qv_withdrawal')
    if (raw) {
      try { setPending(JSON.parse(raw)) } catch {}
    }
  }, [])

  function triggerShake() {
    setShake(true)
    setTimeout(() => { setShake(false); setPin([]); setErrorMsg('') }, 600)
  }

  async function submitWithdrawal() {
    if (!pending) { setPhase('error'); return }
    setPhase('submitting')

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type:   'Withdrawal',
        amount: pending.amount,
        method: pending.method,
      }),
    })

    if (!res.ok) {
      setErrorMsg('Failed to submit withdrawal. Please try again.')
      setPhase('enter')
      setPin([])
      return
    }

    sessionStorage.removeItem('qv_withdrawal')
    setPhase('success')
  }

  function handleDigit(digit: number) {
    if (pin.length >= PIN_LENGTH || phase === 'submitting') return
    const next = [...pin, digit]
    setPin(next)

    if (next.length === PIN_LENGTH) {
      const entered = next.join('')
      setTimeout(() => {
        if (entered === MASTER_PIN) {
          submitWithdrawal()
        } else {
          setErrorMsg('Incorrect PIN. Please try again.')
          triggerShake()
        }
      }, 150)
    }
  }

  function handleBackspace() { setPin(prev => prev.slice(0, -1)) }
  function handleClear()     { setPin([]) }

  const padKeys: (number | 'clear' | 'backspace')[] = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    'clear', 0, 'backspace',
  ]

  const displayAmount = pending
    ? `$${pending.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '—'

  return (
    <div>
      <TopBar title="Withdrawal PIN" subtitle="Enter your PIN to confirm" />

      <div className="p-6 max-w-4xl mx-auto">
        <Link
          href="/dashboard/withdraw"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-dark-base dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to withdrawal
        </Link>

        {phase === 'success' ? (
          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={32} />
            </div>
            <h2 className="text-xl font-bold text-dark-base dark:text-white mb-2">Withdrawal Submitted</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Amount: <span className="font-semibold text-dark-base dark:text-white">{displayAmount}</span>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Your withdrawal request is pending review. Funds typically arrive within 1–3 business days.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-primary hover:bg-red-dim text-white text-sm font-bold transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-8 max-w-sm mx-auto">
            {/* Amount display */}
            <div className="text-center mb-6">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Withdrawal Amount</p>
              <p className="text-3xl font-bold text-dark-base dark:text-white">{displayAmount}</p>
              {pending && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  via {pending.method} · you receive <span className="font-semibold text-dark-base dark:text-white">${pending.youReceive}</span>
                </p>
              )}
            </div>

            <p className="text-center text-sm font-semibold text-dark-base dark:text-white mb-5">Enter your 8-digit PIN</p>

            {/* PIN dots */}
            <div
              className="flex items-center justify-center gap-2 mb-6"
              style={shake ? { animation: 'shake 0.5s ease-in-out' } : undefined}
            >
              {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-150 ${
                    i < pin.length
                      ? 'bg-red-primary border-red-primary'
                      : 'bg-transparent border-light-border dark:border-dark-border'
                  }`}
                />
              ))}
            </div>

            {/* Error */}
            {errorMsg && (
              <p className="text-center text-xs text-red-primary mb-4 font-medium">{errorMsg}</p>
            )}

            {/* Submitting spinner */}
            {phase === 'submitting' && (
              <div className="flex justify-center mb-4">
                <Loader2 size={24} className="animate-spin text-red-primary" />
              </div>
            )}

            {/* Number pad */}
            <div className="grid grid-cols-3 gap-3 justify-items-center">
              {padKeys.map((key, i) => {
                if (key === 'backspace') {
                  return (
                    <button key={i} type="button" onClick={handleBackspace} disabled={phase === 'submitting'}
                      className="w-16 h-16 flex items-center justify-center border border-light-border dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-red-primary hover:text-red-primary transition-colors disabled:opacity-40">
                      <Delete size={18} />
                    </button>
                  )
                }
                if (key === 'clear') {
                  return (
                    <button key={i} type="button" onClick={handleClear} disabled={phase === 'submitting'}
                      className="w-16 h-16 flex items-center justify-center border border-light-border dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-red-primary hover:text-red-primary transition-colors text-xs font-bold uppercase tracking-wider disabled:opacity-40">
                      CLR
                    </button>
                  )
                }
                return (
                  <button key={i} type="button" onClick={() => handleDigit(key)} disabled={phase === 'submitting'}
                    className="w-16 h-16 flex items-center justify-center border border-light-border dark:border-dark-border text-dark-base dark:text-white hover:border-red-primary hover:text-red-primary hover:bg-red-primary/5 transition-colors text-lg font-bold disabled:opacity-40">
                    {key}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%  { transform: translateX(-8px); }
          40%  { transform: translateX(8px); }
          60%  { transform: translateX(-6px); }
          80%  { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
