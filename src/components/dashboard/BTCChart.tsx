'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'

const timeRanges = ['1D', '1W', '1M', '3M', '1Y'] as const
type Range = typeof timeRanges[number]

const rangeToDays: Record<Range, string> = {
  '1D': '1',
  '1W': '7',
  '1M': '30',
  '3M': '90',
  '1Y': '365',
}

interface Candle {
  time:  number
  open:  number
  high:  number
  low:   number
  close: number
}

const W = 600
const H = 180
const PAD_TOP    = 12
const PAD_BOTTOM = 12

function formatPrice(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function CandlestickChart({ candles }: { candles: Candle[] }) {
  if (candles.length === 0) return null

  const allPrices = candles.flatMap(c => [c.high, c.low])
  const min   = Math.min(...allPrices)
  const max   = Math.max(...allPrices)
  const range = max - min || 1

  const chartH = H - PAD_TOP - PAD_BOTTOM
  const slotW  = W / candles.length
  // Body width: comfortable between 2 px and 10 px
  const bodyW  = Math.min(10, Math.max(2, slotW * 0.55))

  function toY(price: number) {
    return PAD_TOP + ((max - price) / range) * chartH
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: H }}
      preserveAspectRatio="none"
    >
      {/* Subtle grid lines */}
      {[0.25, 0.5, 0.75].map(f => (
        <line
          key={f}
          x1={0} y1={PAD_TOP + f * chartH}
          x2={W} y2={PAD_TOP + f * chartH}
          stroke="currentColor"
          strokeOpacity={0.06}
          strokeWidth={1}
        />
      ))}

      {candles.map((c, i) => {
        const cx       = i * slotW + slotW / 2
        const isGreen  = c.close >= c.open
        const color    = isGreen ? '#10B981' : '#EF4444'
        const bodyTop  = toY(Math.max(c.open, c.close))
        const bodyBot  = toY(Math.min(c.open, c.close))
        const bodyH    = Math.max(1, bodyBot - bodyTop)

        return (
          <g key={c.time}>
            {/* Wick */}
            <line
              x1={cx} y1={toY(c.high)}
              x2={cx} y2={toY(c.low)}
              stroke={color}
              strokeWidth={1}
              strokeOpacity={0.9}
            />
            {/* Body */}
            <rect
              x={cx - bodyW / 2}
              y={bodyTop}
              width={bodyW}
              height={bodyH}
              fill={color}
              opacity={0.95}
            />
          </g>
        )
      })}
    </svg>
  )
}

export function BTCChart() {
  const [range,   setRange]   = useState<Range>('1W')
  const [candles, setCandles] = useState<Candle[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  const fetchCandles = useCallback(async (r: Range) => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=${rangeToDays[r]}`,
        { next: { revalidate: 0 } }
      )
      if (!res.ok) throw new Error()
      const raw: [number, number, number, number, number][] = await res.json()
      setCandles(raw.map(([time, open, high, low, close]) => ({ time, open, high, low, close })))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCandles(range) }, [range, fetchCandles])

  const lastCandle  = candles.at(-1)
  const firstCandle = candles.at(0)
  const currentPrice = lastCandle?.close  ?? 0
  const openPrice    = firstCandle?.open  ?? 0
  const change       = currentPrice - openPrice
  const changePct    = openPrice ? (change / openPrice) * 100 : 0
  const isUp         = change >= 0

  const allHighs = candles.map(c => c.high)
  const allLows  = candles.map(c => c.low)
  const periodHigh = allHighs.length ? Math.max(...allHighs) : 0
  const periodLow  = allLows.length  ? Math.min(...allLows)  : 0

  return (
    <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold" style={{ fontSize: 10 }}>₿</span>
            </div>
            <h2 className="text-sm font-bold text-dark-base dark:text-white">Bitcoin (BTC/USD)</h2>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-light-surface dark:bg-dark-surface text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live</span>
          </div>

          {loading ? (
            <div className="h-9 flex items-center">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          ) : error ? (
            <p className="text-xs text-slate-400">Price unavailable</p>
          ) : (
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-dark-base dark:text-white tracking-tight">
                ${formatPrice(currentPrice)}
              </span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${isUp ? 'text-emerald-500' : 'text-red-primary'}`}>
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isUp ? '+' : ''}{formatPrice(change)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
              </div>
            </div>
          )}
        </div>

        {/* Time range tabs */}
        <div className="flex gap-1">
          {timeRanges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-1 text-[11px] font-semibold transition-colors ${
                range === r
                  ? 'bg-red-primary text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center" style={{ height: H }}>
          <Loader2 size={20} className="animate-spin text-slate-300 dark:text-slate-600" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: H }}>
          Could not load chart data
        </div>
      ) : (
        <CandlestickChart candles={candles} />
      )}

      {/* Footer: high / low / source */}
      {!loading && !error && candles.length > 0 && (
        <div className="flex gap-5 mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span>H: <span className="font-semibold text-dark-base dark:text-white">${formatPrice(periodHigh)}</span></span>
          <span>L: <span className="font-semibold text-dark-base dark:text-white">${formatPrice(periodLow)}</span></span>
          <span className="ml-auto">via CoinGecko</span>
        </div>
      )}
    </div>
  )
}
