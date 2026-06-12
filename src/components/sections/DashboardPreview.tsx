'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart2, RefreshCw } from 'lucide-react'
import { portfolioAssets, chartData } from '@/data'

const bigChartPath = (() => {
  const w = 800
  const h = 200
  const min = Math.min(...chartData)
  const max = Math.max(...chartData)
  const range = max - min
  const points = chartData.map((v, i) => {
    const x = (i / (chartData.length - 1)) * w
    const y = h - ((v - min) / range) * (h * 0.75) - h * 0.1
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return {
    line: `M ${points.join(' L ')}`,
    area: `M 0,${h} L ${points.join(' L ')} L ${w},${h} Z`,
  }
})()

export function DashboardPreview() {
  return (
    <section id="dashboard" className="bg-light-surface dark:bg-dark-surface py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-semibold tracking-widest text-orange-primary uppercase mb-4"
          >
            Live Dashboard
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl lg:text-5xl font-bold text-dark-base dark:text-light-base tracking-tight"
          >
            Your wealth, <span className="gradient-text">visualized</span>
          </motion.h2>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-card overflow-hidden"
        >
          {/* Dashboard toolbar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-light-border dark:border-dark-border bg-light-surface/50 dark:bg-dark-surface/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400" />
              <div className="w-3 h-3 bg-amber-400" />
              <div className="w-3 h-3 bg-orange-primary" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
              Live • Updated just now
            </div>
            <div className="flex gap-1">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((range, i) => (
                <button
                  key={range}
                  className={`px-2 py-0.5 text-[10px] font-semibold transition-colors ${i === 2 ? 'bg-orange-primary text-dark-base' : 'text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-light-base'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] divide-y lg:divide-y-0 lg:divide-x divide-light-border dark:divide-dark-border">
            {/* Main chart panel */}
            <div className="p-6">
              {/* Portfolio summary */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Portfolio Value</p>
                  <p className="text-4xl font-bold text-dark-base dark:text-light-base">$847,392.00</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-orange-primary font-semibold text-sm flex items-center gap-1">
                      <TrendingUp size={14} />
                      +$47,218.43
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">+24.7% this month</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center w-full sm:w-auto">
                  {[
                    { label: 'Day P&L', value: '+$2,847', positive: true },
                    { label: 'Total Return', value: '+$184,392', positive: true },
                    { label: 'Sharpe Ratio', value: '2.84', positive: true },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{metric.label}</p>
                      <p className={`text-sm font-bold ${metric.positive ? 'text-orange-primary' : 'text-red-500'}`}>{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="relative h-[200px] overflow-hidden bg-light-surface dark:bg-dark-card">
                <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="bigChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DC2626" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75].map((y) => (
                    <line key={y} x1="0" y1={y * 200} x2="800" y2={y * 200} stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
                  ))}
                  <path d={bigChartPath.area} fill="url(#bigChartGrad)" />
                  <path d={bigChartPath.line} fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
                  <circle cx="800" cy="28" r="4" fill="#DC2626" />
                </svg>
              </div>
            </div>

            {/* Right panel — holdings */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-dark-base dark:text-light-base">Holdings</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <BarChart2 size={12} />
                  6 positions
                </span>
              </div>
              <div className="space-y-2.5">
                {portfolioAssets.map((asset, i) => (
                  <motion.div
                    key={asset.symbol}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-center gap-3 p-2.5 hover:bg-light-surface dark:hover:bg-dark-card transition-colors duration-200"
                  >
                    {/* Asset logo */}
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-light-surface dark:bg-dark-surface">
                      <img src={asset.logo} alt={asset.symbol} className="w-6 h-6 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-dark-base dark:text-light-base">{asset.symbol}</span>
                        <span className={`text-xs font-semibold ${asset.changePercent >= 0 ? 'text-orange-primary' : 'text-red-500'}`}>
                          {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%
                        </span>
                      </div>
                      {/* Allocation bar */}
                      <div className="mt-1 h-1 bg-light-border dark:bg-dark-border overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${asset.allocation}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.06 }}
                          className="h-full bg-orange-primary"
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] font-semibold text-dark-base dark:text-light-base">{asset.allocation}%</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{asset.changePercent >= 0 ? <TrendingUp className="inline" size={9} /> : <TrendingDown className="inline" size={9} />}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
