'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

const assets = [
  { symbol: 'S&P 500',  price: '5,842.31',   change: '+0.84%', up: true  },
  { symbol: 'BTC',      price: '$71,420.00',  change: '+1.77%', up: true  },
  { symbol: 'ETH',      price: '$3,847.00',   change: '+2.38%', up: true  },
  { symbol: 'NVDA',     price: '$892.17',      change: '+2.16%', up: true  },
  { symbol: 'AAPL',     price: '$218.45',      change: '+1.08%', up: true  },
  { symbol: 'MSFT',     price: '$415.32',      change: '-0.77%', up: false },
  { symbol: 'TSLA',     price: '$248.91',      change: '-2.15%', up: false },
  { symbol: 'AMZN',     price: '$198.45',      change: '+0.93%', up: true  },
  { symbol: 'GOLD',     price: '$2,341.00',    change: '+0.43%', up: true  },
  { symbol: 'EUR/USD',  price: '1.0842',       change: '-0.12%', up: false },
  { symbol: 'VIX',      price: '14.32',        change: '-3.21%', up: false },
  { symbol: 'GOOGL',    price: '$175.30',      change: '+1.15%', up: true  },
]

const doubled = [...assets, ...assets]

export function PriceTicker() {
  return (
    <div className="border-b border-light-border dark:border-dark-border bg-light-base dark:bg-dark-base overflow-hidden">
      <div className="w-max flex items-center animate-ticker">
        {doubled.map((asset, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-5 py-2 border-r border-light-border dark:border-dark-border flex-shrink-0"
          >
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {asset.symbol}
            </span>
            <span className="text-[11px] font-mono font-semibold text-dark-base dark:text-white">
              {asset.price}
            </span>
            <span className={`flex items-center gap-0.5 text-[11px] font-bold ${asset.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-primary'}`}>
              {asset.up
                ? <TrendingUp size={10} />
                : <TrendingDown size={10} />}
              {asset.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
