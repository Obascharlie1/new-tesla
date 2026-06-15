'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Landmark, CircleDollarSign, CreditCard, Loader2 } from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'
import { createClient } from '@/lib/supabase/client'

type Method = 'bank' | 'bitcoin' | 'paypal'

const methods: { id: Method; label: string; icon: React.ElementType; fee: string; feePercent: number }[] = [
  { id: 'bank',    label: 'Bank Transfer', icon: Landmark,          fee: 'No fee',    feePercent: 0     },
  { id: 'bitcoin', label: 'Bitcoin',       icon: CircleDollarSign,  fee: '0.5% fee',  feePercent: 0.005 },
  { id: 'paypal',  label: 'PayPal',        icon: CreditCard,        fee: '2.9% fee',  feePercent: 0.029 },
]

export default function WithdrawPage() {
  const router = useRouter()
  const [balance,  setBalance]  = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [amount,   setAmount]   = useState('')
  const [method,   setMethod]   = useState<Method>('bank')
  const [fields,   setFields]   = useState({
    accountName:   '',
    accountNumber: '',
    sortCode:      '',
    btcAddress:    '',
    paypalEmail:   '',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('profit').eq('id', user.id).single()
      setBalance(data?.profit ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  const amountNum      = parseFloat(amount) || 0
  const selectedMethod = methods.find(m => m.id === method)!
  const fee            = amountNum * selectedMethod.feePercent
  const youReceive     = Math.max(0, amountNum - fee)

  function updateField(key: keyof typeof fields, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    // Store withdrawal details for the PIN page to read
    sessionStorage.setItem('qv_withdrawal', JSON.stringify({
      amount: amountNum,
      method: selectedMethod.label,
      fee: fee.toFixed(2),
      youReceive: youReceive.toFixed(2),
    }))
    router.push('/dashboard/withdraw/pin')
  }

  return (
    <div>
      <TopBar title="Withdraw Funds" subtitle="Withdraw to your preferred destination" />

      <div className="p-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={24} className="animate-spin text-white" />
          </div>
        ) : (
          <form onSubmit={handleContinue} className="space-y-5">
            {/* Available balance */}
            <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Available Balance
              </p>
              <p className="text-3xl font-bold text-white">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Amount input */}
            <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-6">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Withdrawal Amount (USD)
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="10"
                    max={balance}
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setAmount(balance.toFixed(2))}
                  className="px-4 py-3 border border-white/10 text-xs font-bold text-slate-400 hover:border-white/30 hover:text-white rounded-lg transition-colors"
                >
                  Max
                </button>
              </div>

              {/* Fee calculation */}
              {amountNum > 0 && (
                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Withdrawal amount</span>
                    <span className="font-semibold text-white">${amountNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee ({selectedMethod.fee})</span>
                    <span className="font-semibold text-white">-${fee.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/[0.08] my-1" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">You receive</span>
                    <span className="text-emerald-400">${youReceive.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Method selection */}
            <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-6">
              <p className="block text-xs font-semibold text-white uppercase tracking-wider mb-4">
                Withdrawal Method
              </p>
              <div className="space-y-3">
                {methods.map(m => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                      method === m.id
                        ? 'border-white/30 bg-white/[0.06]'
                        : 'border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m.id}
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      method === m.id ? 'bg-white/15' : 'bg-white/[0.06]'
                    }`}>
                      <m.icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {m.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{m.fee}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      method === m.id ? 'border-white' : 'border-white/20'
                    }`}>
                      {method === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional recipient fields */}
            <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-6 space-y-5">
              <p className="block text-xs font-semibold text-white uppercase tracking-wider">
                Recipient Details
              </p>

              {method === 'bank' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">Account Name</label>
                    <input type="text" value={fields.accountName} onChange={e => updateField('accountName', e.target.value)} placeholder="John Doe"
                      className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">Account Number</label>
                      <input type="text" value={fields.accountNumber} onChange={e => updateField('accountNumber', e.target.value)} placeholder="0000 0000 0000"
                        className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">Sort Code</label>
                      <input type="text" value={fields.sortCode} onChange={e => updateField('sortCode', e.target.value)} placeholder="00-00-00"
                        className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors rounded-lg" />
                    </div>
                  </div>
                </>
              )}

              {method === 'bitcoin' && (
                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">Bitcoin Address</label>
                  <input type="text" value={fields.btcAddress} onChange={e => updateField('btcAddress', e.target.value)} placeholder="bc1q..."
                    className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors rounded-lg font-mono" />
                  <p className="text-xs text-slate-400 mt-1.5">Double-check the address — BTC transactions are irreversible.</p>
                </div>
              )}

              {method === 'paypal' && (
                <div>
                  <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">PayPal Email</label>
                  <input type="email" value={fields.paypalEmail} onChange={e => updateField('paypalEmail', e.target.value)} placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors rounded-lg" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!amount || amountNum < 10 || amountNum > balance}
              className="w-full bg-white hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3.5 text-sm rounded-full transition-colors"
            >
              Continue to PIN
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
