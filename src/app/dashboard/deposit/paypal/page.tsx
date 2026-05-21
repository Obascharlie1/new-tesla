'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, CheckCircle, Loader2 } from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'

const PAYPAL_EMAIL = 'payments@quantumvest.io'
const REFERENCE    = 'QV847392'

const steps = [
  'Log in to your PayPal account and go to Send & Request.',
  `Enter the PayPal email: ${PAYPAL_EMAIL} and the exact amount you wish to deposit.`,
  `In the note/memo field, include your reference: ${REFERENCE} — this is required to match your payment.`,
]

export default function PaypalDepositPage() {
  const [emailCopied, setEmailCopied] = useState(false)
  const [refCopied,   setRefCopied]   = useState(false)
  const [amount,      setAmount]      = useState('')
  const [loading,     setLoading]     = useState(false)
  const [submitted,   setSubmitted]   = useState(false)
  const [error,       setError]       = useState('')

  function copyEmail() {
    navigator.clipboard.writeText(PAYPAL_EMAIL).catch(() => {})
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  function copyRef() {
    navigator.clipboard.writeText(REFERENCE).catch(() => {})
    setRefCopied(true)
    setTimeout(() => setRefCopied(false), 2000)
  }

  const fee = amount ? (parseFloat(amount) * 0.029).toFixed(2) : null
  const net = amount && fee ? (parseFloat(amount) - parseFloat(fee)).toFixed(2) : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!amt || amt < 100) { setError('Minimum deposit is $100.'); return }
    setError('')
    setLoading(true)

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'Deposit', amount: amt, method: 'PayPal', note: `Ref: ${REFERENCE}` }),
    })

    if (!res.ok) {
      const { error: msg } = await res.json()
      setError(msg ?? 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div>
      <TopBar title="PayPal Deposit" subtitle="Send funds via your PayPal account" />

      <div className="p-6 max-w-4xl mx-auto">
        <Link
          href="/dashboard/deposit"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-dark-base dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to deposit methods
        </Link>

        {submitted ? (
          <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={32} />
            </div>
            <h2 className="text-xl font-bold text-dark-base dark:text-white mb-2">Payment Recorded</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed max-w-sm mx-auto">
              Your deposit request has been submitted. Once we receive your PayPal payment, your account will be credited — usually within a few minutes.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-primary hover:bg-red-dim text-white text-sm font-bold transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {/* PayPal email */}
            <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
              <p className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-3">
                PayPal Email
              </p>
              <div className="flex items-center gap-3 p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                <code className="flex-1 font-mono text-sm text-dark-base dark:text-white">{PAYPAL_EMAIL}</code>
                <button
                  onClick={copyEmail}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-light-border dark:border-dark-border text-xs font-semibold text-slate-500 dark:text-slate-400 hover:border-red-primary hover:text-red-primary transition-colors"
                >
                  {emailCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
              <p className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-4">How to Deposit</p>
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-primary text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Amount + reference form */}
            <form onSubmit={handleSubmit} className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 space-y-5">
              {error && (
                <div className="px-4 py-3 bg-red-primary/10 border border-red-primary/30 text-red-primary text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="100"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-red-primary transition-colors"
                  />
                </div>
                {fee && net && (
                  <div className="mt-2 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>Fee (2.9%): <span className="font-semibold text-dark-base dark:text-white">${fee}</span></span>
                    <span>You receive: <span className="font-semibold text-dark-base dark:text-white">${net}</span></span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">
                  Reference (include in PayPal memo)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={REFERENCE}
                    readOnly
                    className="flex-1 px-4 py-3 border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface text-dark-base dark:text-white text-sm focus:outline-none font-mono cursor-default select-all"
                  />
                  <button
                    type="button"
                    onClick={copyRef}
                    className="flex items-center gap-1.5 px-3 py-3 border border-light-border dark:border-dark-border text-xs font-semibold text-slate-500 dark:text-slate-400 hover:border-red-primary hover:text-red-primary transition-colors"
                  >
                    {refCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !amount}
                className="w-full bg-red-primary hover:bg-red-dim disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : "I've Sent via PayPal"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
