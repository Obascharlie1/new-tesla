'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Info, CheckCircle } from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'
import { createClient } from '@/lib/supabase/client'

const CATALOG = [
  { symbol: 'TSLA',  name: 'Tesla',     price: 248.50,  change: +2.14 },
  { symbol: 'SPCX',  name: 'SpaceX',    price: 412.00,  change: +1.87 },
  { symbol: 'META',  name: 'Meta',      price: 578.30,  change: -0.43 },
  { symbol: 'AAPL',  name: 'Apple',     price: 189.40,  change: +0.92 },
  { symbol: 'NVDA',  name: 'NVIDIA',    price: 895.60,  change: +3.21 },
  { symbol: 'AMZN',  name: 'Amazon',    price: 195.80,  change: +1.15 },
  { symbol: 'MSFT',  name: 'Microsoft', price: 420.50,  change: +0.67 },
  { symbol: 'GOOGL', name: 'Alphabet',  price: 175.20,  change: -0.28 },
]

const CATALOG_MAP: Record<string, { price: number }> = Object.fromEntries(
  CATALOG.map(s => [s.symbol, { price: s.price }])
)

const COLORS: Record<string, string> = {
  TSLA: '#CC0000', SPCX: '#1A1A2E', META: '#1877F2',
  AAPL: '#555555', NVDA: '#76B900', AMZN: '#FF9900',
  MSFT: '#00A4EF', GOOGL: '#4285F4',
}

interface ShareRow {
  id: string
  symbol: string
  name: string
  quantity: number
  purchase_price: number
  purchase_amount: number
}

interface Holding {
  symbol: string
  name: string
  total_quantity: number
  total_invested: number
}

interface CatalogShare {
  symbol: string
  name: string
  price: number
  change: number
}

interface SuccessInfo {
  symbol: string
  name: string
  quantity: number
  amount: number
}

function groupHoldings(rows: ShareRow[]): Holding[] {
  const map: Record<string, Holding> = {}
  for (const r of rows) {
    if (!map[r.symbol]) {
      map[r.symbol] = { symbol: r.symbol, name: r.name, total_quantity: 0, total_invested: 0 }
    }
    map[r.symbol].total_quantity += Number(r.quantity)
    map[r.symbol].total_invested += Number(r.purchase_amount)
  }
  return Object.values(map)
}

function Confetti() {
  const [pieces, setPieces] = useState<Array<{
    id: number
    color: string
    left: number
    delay: number
    duration: number
    size: number
    round: boolean
  }>>([])

  useEffect(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD700', '#FF69B4', '#00CED1', '#98FB98', '#FFA07A', '#87CEEB']
    setPieces(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2.5 + Math.random() * 2,
        size: 6 + Math.random() * 8,
        round: Math.random() > 0.5,
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute confetti-piece"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function SharesPage() {
  const [holdings, setHoldings] = useState<ShareRow[]>([])
  const [userProfit, setUserProfit] = useState(0)
  const [selectedShare, setSelectedShare] = useState<CatalogShare | null>(null)
  const [mode, setMode] = useState<'quantity' | 'amount'>('quantity')
  const [inputValue, setInputValue] = useState('')
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<SuccessInfo | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [holdingsRes, profileRes] = await Promise.all([
        fetch('/api/shares'),
        supabase.from('profiles').select('profit').eq('id', user.id).single(),
      ])
      const { data: holdingsData } = await holdingsRes.json()
      setHoldings(holdingsData ?? [])
      setUserProfit(profileRes.data?.profit ?? 0)
    }
    load()
  }, [])

  async function handleBuy() {
    if (!selectedShare || !inputValue) return
    setBuying(true)
    setError('')

    const quantity = mode === 'quantity'
      ? parseFloat(inputValue)
      : parseFloat(inputValue) / selectedShare.price
    const purchaseAmount = mode === 'amount'
      ? parseFloat(inputValue)
      : parseFloat(inputValue) * selectedShare.price

    const res = await fetch('/api/shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: selectedShare.symbol,
        name: selectedShare.name,
        quantity,
        purchasePrice: selectedShare.price,
        purchaseAmount,
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Purchase failed')
      setBuying(false)
      return
    }

    setSuccess({ symbol: selectedShare.symbol, name: selectedShare.name, quantity, amount: purchaseAmount })
    setSelectedShare(null)
    setInputValue('')
    setBuying(false)
    // Refresh holdings
    fetch('/api/shares').then(r => r.json()).then(({ data }) => setHoldings(data ?? []))
    setUserProfit(prev => prev - purchaseAmount)
  }

  const groupedHoldings = groupHoldings(holdings)

  // Derived values for modal summary
  const parsedInput = parseFloat(inputValue) || 0
  const approxQty = selectedShare && mode === 'amount' ? parsedInput / selectedShare.price : null
  const approxTotal = selectedShare && mode === 'quantity' ? parsedInput * selectedShare.price : null

  return (
    <div>
      <TopBar title="Buy Shares" subtitle="Trade top stocks" />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">

        {/* Available profit balance */}
        <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Available profit</p>
            <p className="text-2xl font-bold text-white">
              ${userProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Info size={16} className="text-slate-500" />
            <p className="text-xs text-slate-400 text-right max-w-[140px]">
              Shares are purchased using your profit balance
            </p>
          </div>
        </div>

        {/* My Holdings */}
        {groupedHoldings.length > 0 && (
          <div className="bg-white/5 border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.08]">
              <h2 className="text-sm font-bold text-white">My Holdings</h2>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {groupedHoldings.map(h => {
                const catalog = CATALOG_MAP[h.symbol]
                const currentValue = catalog ? h.total_quantity * catalog.price : h.total_invested
                const gainPct = h.total_invested > 0
                  ? ((currentValue - h.total_invested) / h.total_invested) * 100
                  : 0
                return (
                  <div key={h.symbol} className="flex items-center gap-3 px-5 py-3.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
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

        {/* Available Shares */}
        <div>
          <h2 className="text-sm font-bold text-white mb-3">Available Shares</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATALOG.map(share => (
              <button
                key={share.symbol}
                onClick={() => { setSelectedShare(share); setInputValue(''); setMode('quantity'); setError('') }}
                className="bg-white/5 border border-white/[0.08] rounded-2xl p-4 cursor-pointer hover:bg-white/[0.08] hover:border-white/20 transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: COLORS[share.symbol] ?? '#333' }}
                  >
                    {share.symbol.slice(0, 2)}
                  </div>
                  <span className="text-xs font-bold text-white">{share.symbol}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{share.name}</p>
                <p className="text-xl font-bold text-white mt-3">
                  ${share.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={`text-xs font-semibold mt-1 ${share.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {share.change >= 0 ? '▲' : '▼'} {Math.abs(share.change).toFixed(2)}%
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      {selectedShare && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: COLORS[selectedShare.symbol] ?? '#333' }}
                >
                  {selectedShare.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedShare.name}</p>
                  <p className="text-xs text-slate-400">{selectedShare.symbol}</p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedShare(null); setInputValue(''); setError('') }}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Current price */}
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current price</p>
            <p className="text-2xl font-bold text-white mb-5">
              ${selectedShare.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-5 p-1 bg-white/5 rounded-full">
              <button
                onClick={() => { setMode('quantity'); setInputValue('') }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  mode === 'quantity' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                By Quantity
              </button>
              <button
                onClick={() => { setMode('amount'); setInputValue('') }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  mode === 'amount' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                By Amount ($)
              </button>
            </div>

            {/* Input */}
            <input
              type="number"
              min="0"
              step="any"
              value={inputValue}
              onChange={e => { setInputValue(e.target.value); setError('') }}
              placeholder="0"
              className="text-center text-3xl font-bold bg-transparent text-white border-b border-white/20 focus:outline-none focus:border-white/50 py-3 w-full mb-3"
            />

            {/* Summary */}
            <div className="text-center mb-2 min-h-[20px]">
              {mode === 'amount' && parsedInput > 0 && (
                <p className="text-sm text-slate-400">
                  ≈ {approxQty!.toFixed(6)} shares
                </p>
              )}
              {mode === 'quantity' && parsedInput > 0 && (
                <p className="text-sm text-slate-400">
                  ≈ ${approxTotal!.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total
                </p>
              )}
            </div>

            {/* Available balance */}
            <p className="text-center text-xs text-slate-500 mb-4">
              Available: ${userProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 text-center mb-3">{error}</p>
            )}

            {/* Buy button */}
            <button
              onClick={handleBuy}
              disabled={!inputValue || parsedInput <= 0 || buying}
              className="w-full bg-white text-black font-bold rounded-full py-4 text-base transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              {buying ? 'Processing…' : `Buy ${selectedShare.symbol}`}
            </button>
          </div>
        </div>
      )}

      {/* Success overlay */}
      {success && (
        <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col items-center justify-center p-6">
          <Confetti />
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mt-6">Purchase Complete!</h2>
          <p className="text-slate-400 mt-2 text-center">
            You bought {success.quantity.toFixed(6)} shares of {success.name} for $
            {success.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex flex-col gap-3 mt-8 w-full max-w-xs">
            <button
              onClick={() => { setSuccess(null); setSelectedShare(null) }}
              className="w-full bg-white/10 text-white border border-white/10 font-bold rounded-full py-3 text-sm hover:bg-white/15 transition-colors"
            >
              Buy More Shares
            </button>
            <Link
              href="/dashboard"
              className="w-full bg-white text-black font-bold rounded-full py-3 text-sm text-center hover:bg-slate-100 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
