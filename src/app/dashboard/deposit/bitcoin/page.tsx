'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, CheckCircle, Loader2, Upload, FileText } from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'

const BTC_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
const BTC_RATE = 67420

// 10×10 QR pattern (finder patterns + data)
const QR_GRID: boolean[][] = [
  [true, true, true, true, true, true, true, false, true, false],
  [true, false, false, false, false, false, true, false, false, true],
  [true, false, true, true, true, false, true, false, true, false],
  [true, false, true, true, true, false, true, false, false, true],
  [true, false, true, true, true, false, true, false, true, true],
  [true, false, false, false, false, false, true, false, false, false],
  [true, true, true, true, true, true, true, false, true, false],
  [false, false, false, false, false, false, false, false, false, true],
  [true, false, true, false, true, true, true, false, true, false],
  [false, true, false, true, false, false, false, true, false, true],
]

export default function BitcoinDepositPage() {
  const [copied,    setCopied]    = useState(false)
  const [amountUsd, setAmountUsd] = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')
  const [receipt,   setReceipt]   = useState<{ name: string; size: string } | null>(null)
  const receiptRef = useRef<HTMLInputElement>(null)

  function handleReceiptChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const kb = f.size / 1024
    const size = kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`
    setReceipt({ name: f.name, size })
  }

  const btcAmount = amountUsd ? (parseFloat(amountUsd) / BTC_RATE).toFixed(8) : null

  function copyAddress() {
    navigator.clipboard.writeText(BTC_ADDRESS).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amt = parseFloat(amountUsd)
    if (!amt || amt < 100) { setError('Minimum deposit is $100.'); return }
    setError('')
    setLoading(true)

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'Deposit', amount: amt, method: 'Bitcoin' }),
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
      <TopBar title="Bitcoin Deposit" subtitle="Send BTC to the address below" />

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
            <h2 className="text-xl font-bold text-dark-base dark:text-white mb-2">Bitcoin Deposit Recorded</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed max-w-sm mx-auto">
              Your deposit request has been submitted. We&apos;ll credit your account once 3 blockchain confirmations are received (typically 30–60 minutes).
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
            {/* Address + QR */}
            <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
              <p className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-4">
                Bitcoin Wallet Address
              </p>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* QR Code SVG */}
                <div className="flex-shrink-0 p-3 bg-white border border-light-border dark:border-dark-border">
                  <svg width="120" height="120" viewBox="0 0 100 100">
                    {QR_GRID.map((row, ri) =>
                      row.map((cell, ci) =>
                        cell ? (
                          <rect key={`${ri}-${ci}`} x={ci * 10} y={ri * 10} width={9} height={9} fill="#0A0A0A" />
                        ) : null
                      )
                    )}
                  </svg>
                </div>
                {/* Address + copy */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Send Bitcoin to this address only. Do not send any other cryptocurrency.
                  </p>
                  <div className="flex items-center gap-3 p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                    <code className="flex-1 font-mono text-xs text-dark-base dark:text-white break-all leading-relaxed">
                      {BTC_ADDRESS}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-light-border dark:border-dark-border text-xs font-semibold text-slate-500 dark:text-slate-400 hover:border-red-primary hover:text-red-primary transition-colors"
                    >
                      {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>
                  <div className="mt-3 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>Min: <span className="font-semibold text-dark-base dark:text-white">$100</span></span>
                    <span>Confirmations: <span className="font-semibold text-dark-base dark:text-white">3</span></span>
                    <span>Network: <span className="font-semibold text-dark-base dark:text-white">Bitcoin</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount + submit */}
            <form onSubmit={handleSubmit} className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 space-y-5">
              {error && (
                <div className="px-4 py-3 bg-red-primary/10 border border-red-primary/30 text-red-primary text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">
                  Amount in USD
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="number"
                    value={amountUsd}
                    onChange={(e) => setAmountUsd(e.target.value)}
                    placeholder="0.00"
                    min="100"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-red-primary transition-colors"
                  />
                </div>
                {btcAmount && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Estimated BTC:</span>
                    <span className="text-xs font-semibold font-mono text-dark-base dark:text-white">₿{btcAmount}</span>
                    <span className="text-xs text-slate-400">@ ${BTC_RATE.toLocaleString()}/BTC</span>
                  </div>
                )}
              </div>

              {/* Receipt upload (cosmetic) */}
              <div>
                <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">
                  Upload Payment Receipt <span className="text-slate-400 normal-case font-normal">(optional)</span>
                </label>
                <button
                  type="button"
                  onClick={() => receiptRef.current?.click()}
                  className={`w-full border-2 border-dashed p-5 text-center transition-colors ${
                    receipt
                      ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10'
                      : 'border-light-border dark:border-dark-border hover:border-red-primary hover:bg-red-primary/5'
                  }`}
                >
                  {receipt ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size={18} className="text-emerald-500" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-dark-base dark:text-white">{receipt.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{receipt.size}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Upload size={16} />
                      <span className="text-sm">Screenshot or PDF of your transaction</span>
                    </div>
                  )}
                </button>
                <input ref={receiptRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleReceiptChange} />
              </div>

              <button
                type="submit"
                disabled={loading || !amountUsd}
                className="w-full bg-red-primary hover:bg-red-dim disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : "I've Sent Bitcoin"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
