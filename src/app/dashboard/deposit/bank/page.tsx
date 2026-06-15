'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, CheckCircle, Loader2, Upload, FileText } from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'

const REFERENCE = 'QV-2025-847392'

interface BankDetails { label: string; value: string }

const DEFAULT_BANK: BankDetails[] = [
  { label: 'Bank Name',       value: 'Chase Bank' },
  { label: 'Account Name',   value: 'Tesla Capital Ltd' },
  { label: 'Account Number', value: '4521 8847 3920 1547' },
  { label: 'Sort Code',      value: '20-19-15' },
  { label: 'SWIFT / BIC',    value: 'CHASUS33' },
]

export default function BankDepositPage() {
  const [bankDetails, setBankDetails] = useState<BankDetails[]>(DEFAULT_BANK)
  const [copied,      setCopied]      = useState(false)
  const [amount,      setAmount]      = useState('')
  const [loading,     setLoading]     = useState(false)
  const [submitted,   setSubmitted]   = useState(false)
  const [error,       setError]       = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const receiptRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/payment-config')
      .then(r => r.json())
      .then(d => {
        setBankDetails([
          { label: 'Bank Name',       value: d.bank_name           || DEFAULT_BANK[0].value },
          { label: 'Account Name',   value: d.bank_account_name   || DEFAULT_BANK[1].value },
          { label: 'Account Number', value: d.bank_account_number || DEFAULT_BANK[2].value },
          { label: 'Sort Code',      value: d.bank_sort_code      || DEFAULT_BANK[3].value },
          { label: 'SWIFT / BIC',    value: d.bank_swift          || DEFAULT_BANK[4].value },
        ])
      })
      .catch(() => {})
  }, [])

  function copyReference() {
    navigator.clipboard.writeText(REFERENCE).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!amt || amt < 100) { setError('Minimum deposit is $100.'); return }
    setError('')
    setLoading(true)

    let receipt_url: string | null = null
    if (receiptFile) {
      const form = new FormData()
      form.append('file', receiptFile)
      const up = await fetch('/api/receipts/upload', { method: 'POST', body: form })
      if (up.ok) receipt_url = (await up.json()).path
    }

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'Deposit', amount: amt, method: 'Bank Transfer', note: `Ref: ${REFERENCE}`, receipt_url }),
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
      <TopBar title="Bank Transfer" subtitle="Send funds directly from your bank" />

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
            <h2 className="text-xl font-bold text-dark-base dark:text-white mb-2">Transfer Recorded</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 leading-relaxed max-w-sm mx-auto">
              We&apos;ve recorded your deposit request. Once your bank sends the funds and we verify receipt, your account will be credited within 0–3 business days.
            </p>
            <p className="text-xs text-slate-400 mb-6">Reference: <span className="font-mono font-semibold text-dark-base dark:text-white">{REFERENCE}</span></p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-dim text-white text-sm font-bold transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Reference number */}
            <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
              <p className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-3">
                Your Reference Number
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Include this reference with your bank transfer so we can match your payment.
              </p>
              <div className="flex items-center gap-3 p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                <code className="flex-1 font-mono text-base font-bold text-dark-base dark:text-white tracking-wider">
                  {REFERENCE}
                </code>
                <button
                  onClick={copyReference}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-light-border dark:border-dark-border text-xs font-semibold text-slate-500 dark:text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-colors"
                >
                  {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>

            {/* Bank details */}
            <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
              <p className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-4">
                Bank Details
              </p>
              <div className="divide-y divide-light-border dark:divide-dark-border">
                {bankDetails.map((detail) => (
                  <div key={detail.label} className="flex items-center justify-between py-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{detail.label}</span>
                    <span className="text-sm font-semibold text-dark-base dark:text-white font-mono">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount + submit */}
            <form onSubmit={handleSubmit} className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 space-y-5">
              {error && (
                <div className="px-4 py-3 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">
                  Transfer Amount (USD)
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
                    className="w-full pl-8 pr-4 py-3 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Minimum: $100.00 · No platform fee</p>
              </div>

              {/* Receipt upload */}
              <div>
                <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">
                  Payment Receipt <span className="text-slate-400 normal-case font-normal">(optional)</span>
                </label>
                <button
                  type="button"
                  onClick={() => receiptRef.current?.click()}
                  className={`w-full border-2 border-dashed p-5 text-center transition-colors ${
                    receiptFile
                      ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10'
                      : 'border-light-border dark:border-dark-border hover:border-brand-primary hover:bg-brand-primary/5'
                  }`}
                >
                  {receiptFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size={18} className="text-emerald-500" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-dark-base dark:text-white">{receiptFile.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{(receiptFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Upload size={16} />
                      <span className="text-sm">Screenshot or PDF of your transfer</span>
                    </div>
                  )}
                </button>
                <input ref={receiptRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => setReceiptFile(e.target.files?.[0] ?? null)} />
              </div>

              <button
                type="submit"
                disabled={loading || !amount}
                className="w-full bg-brand-primary hover:bg-brand-dim disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : "I've Made the Transfer"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
