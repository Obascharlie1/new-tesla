'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { chartData, portfolioAssets } from '@/data'

const chartPath = (() => {
  const w = 500
  const h = 140
  const min = Math.min(...chartData)
  const max = Math.max(...chartData)
  const range = max - min
  const points = chartData.map((v, i) => {
    const x = (i / (chartData.length - 1)) * w
    const y = h - ((v - min) / range) * (h * 0.8) - h * 0.1
    return `${x},${y}`
  })
  return {
    line: `M ${points.join(' L ')}`,
    area: `M 0,${h} L ${points.join(' L ')} L ${w},${h} Z`,
  }
})()

const liveMetrics = [
  { label: 'S&P 500', value: '5,842.31', change: '+0.84%', up: true },
  { label: 'BTC/USD', value: '$71,420', change: '+1.77%', up: true },
  { label: 'NVDA', value: '$892.17', change: '+2.16%', up: true },
  { label: 'VIX', value: '14.32', change: '-3.21%', up: false },
  { label: 'GOLD', value: '$2,341', change: '+0.43%', up: true },
  { label: 'EUR/USD', value: '1.0842', change: '-0.12%', up: false },
]

// ── Headline "arrange" animation ─────────────────────────────
// Letters fly in from a scattered/blurred offset and settle into place.
const headlineContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.15 } },
}
const headlineLetter: Variants = {
  hidden: { opacity: 0, y: 28, rotate: -8, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

function arrangeLetters(text: string, extra = '') {
  return text.split('').map((ch, i) => (
    <motion.span key={extra + i} variants={headlineLetter} className={`inline-block ${extra}`}>
      {ch === ' ' ? ' ' : ch}
    </motion.span>
  ))
}

export function Hero() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-screen flex items-center pt-28 sm:pt-24 lg:pt-20 pb-16 overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay — same in both light and dark mode */}
      <div className="absolute inset-0 bg-dark-base/80" />

      {/* Subtle grid on top of overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#E0241C 1px, transparent 1px), linear-gradient(90deg, #E0241C 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Red vertical accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — copy */}
          <div className="text-center lg:text-left">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-8"
            >
              <div className="w-6 h-px bg-brand-primary" />
              <span className="text-xs font-bold tracking-widest text-brand-primary uppercase">
                Engineered for Speed
              </span>
            </motion.div>

            {/* Headline — letters arrange into place */}
            <motion.h1
              variants={headlineContainer}
              initial="hidden"
              animate="visible"
              className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.02] tracking-tight mb-6"
            >
              {arrangeLetters('Trade')}
              <br />
              {arrangeLetters('faster.', 'gradient-text')}
              <br />
              {arrangeLetters('Win more.')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-md mx-auto lg:mx-0 lg:border-l-2 lg:border-dark-border lg:pl-4"
            >
              AI signals, sub-50ms fills, and automated risk control — the firepower hedge funds guard, handed to traders who move first.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col xs:flex-row sm:flex-row gap-3 mb-10 items-center justify-center lg:items-start lg:justify-start"
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 font-bold tracking-tight rounded-lg px-7 py-3.5 text-base bg-brand-primary text-white hover:bg-brand-dim border border-brand-primary transition-all duration-150"
              >
                Start Trading
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 font-bold tracking-tight rounded-lg px-7 py-3.5 text-base border border-white/30 text-white hover:bg-white/10 transition-all duration-150"
              >
                Sign In
              </Link>
            </motion.div>

            {/* Hard stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="grid grid-cols-3 border-t border-dark-border pt-8"
            >
              {[
                { num: '10.4M', label: 'Traders' },
                { num: '$48B+', label: 'Volume' },
                { num: '98.3%', label: 'AI Accuracy' },
              ].map((s, i) => (
                <div key={s.label} className={`${i !== 0 ? 'border-l border-dark-border pl-6' : ''}`}>
                  <p className="text-2xl font-black text-white tracking-tight">{s.num}</p>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main dashboard panel */}
            <div className="border border-dark-border bg-dark-card">
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-primary" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Portfolio</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">LIVE</span>
              </div>

              {/* Portfolio value */}
              <div className="px-4 py-4 border-b border-dark-border">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Value</p>
                <p className="text-3xl font-black text-white font-mono tracking-tight">$847,392.00</p>
                <span className="text-sm font-bold text-brand-primary flex items-center gap-1 mt-1">
                  <TrendingUp size={14} />
                  +$47,218 · +24.7% MTD
                </span>
              </div>

              {/* Chart */}
              <div className="h-[90px] sm:h-[130px] bg-dark-surface relative">
                <svg viewBox="0 0 500 140" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E0241C" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#E0241C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75].map((y) => (
                    <line key={y} x1="0" y1={y * 140} x2="500" y2={y * 140} stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
                  ))}
                  <path d={chartPath.area} fill="url(#chartFill)" />
                  <path d={chartPath.line} fill="none" stroke="#E0241C" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                  <circle cx="500" cy="19" r="3" fill="#E0241C" />
                </svg>
              </div>

              {/* Assets grid — hidden on mobile to keep hero compact */}
              <div className="hidden sm:grid grid-cols-2">
                {portfolioAssets.slice(0, 4).map((asset, i) => (
                  <div
                    key={asset.symbol}
                    className={`flex items-center gap-2 px-3 py-2.5 ${i < 2 ? 'border-b' : ''} ${i % 2 === 0 ? 'border-r' : ''} border-dark-border`}
                  >
                    <img src={asset.logo} alt={asset.symbol} className="w-6 h-6 object-contain flex-shrink-0 invert" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">{asset.symbol}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{asset.allocation}%</p>
                    </div>
                    <span className={`text-xs font-bold flex items-center gap-0.5 ${asset.changePercent >= 0 ? 'text-brand-primary' : 'text-red-400'}`}>
                      {asset.changePercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live market ticker below card — hidden on mobile */}
            <div className="hidden sm:block mt-3 border border-dark-border overflow-hidden">
              <div className="flex">
                {liveMetrics.map((m) => (
                  <div key={m.label} className="flex items-center gap-2 px-4 py-2 border-r border-dark-border whitespace-nowrap flex-shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{m.label}</span>
                    <span className="text-[10px] font-mono font-bold text-white">{m.value}</span>
                    <span className={`text-[10px] font-bold ${m.up ? 'text-brand-primary' : 'text-slate-400'}`}>{m.change}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
