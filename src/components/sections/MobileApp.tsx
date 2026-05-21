'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Bell, BarChart2, Wallet, CheckCircle } from 'lucide-react'

const appFeatures = [
  { icon: BarChart2, label: 'Live portfolio charts and P&L tracking' },
  { icon: Bell, label: 'Instant AI signal and price alerts' },
  { icon: Wallet, label: 'One-tap deposits and withdrawals' },
  { icon: TrendingUp, label: 'Trade execution in under 50ms' },
]

export function MobileApp() {
  return (
    <section className="bg-dark-base relative overflow-hidden py-24 lg:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dark-surface via-dark-base to-dark-base" />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-red-primary/4 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-semibold tracking-widest text-red-primary uppercase mb-4"
            >
              Mobile App
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="text-4xl lg:text-5xl font-black text-light-base tracking-tight mb-4"
            >
              Your portfolio
              <br />
              in your{' '}
              <span className="gradient-text">pocket</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 leading-relaxed mb-8"
            >
              The QuantumVest mobile app gives you full platform power on iOS and Android. Trade, monitor, and manage from anywhere in the world.
            </motion.p>

            {/* Feature list */}
            <ul className="space-y-3 mb-10">
              {appFeatures.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <motion.li
                    key={feature.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-md bg-red-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-red-primary" />
                    </div>
                    <span className="text-sm text-light-base/80">{feature.label}</span>
                  </motion.li>
                )
              })}
            </ul>

            {/* Download badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { store: 'App Store', sub: 'Download on the', rating: '4.9★' },
                { store: 'Google Play', sub: 'Get it on', rating: '4.8★' },
              ].map((badge) => (
                <button
                  key={badge.store}
                  className="flex items-center gap-3 px-4 py-3 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-primary/40 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                >
                  <div className="text-left">
                    <p className="text-[10px] text-light-base/50">{badge.sub}</p>
                    <p className="text-sm font-bold text-light-base">{badge.store}</p>
                  </div>
                  <span className="text-xs font-semibold text-red-primary">{badge.rating}</span>
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right — phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="animate-float relative"
            >
              {/* Phone outer frame */}
              <div className="relative w-[260px] mx-auto">
                <div className="rounded-3xl bg-dark-card border-2 border-white/10 shadow-2xl overflow-hidden" style={{ height: '540px' }}>
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 py-3 bg-dark-surface/80">
                    <span className="text-[10px] text-light-base/60 font-medium">9:41</span>
                    <div className="w-20 h-4 rounded-full bg-dark-base/80 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-dark-border" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[3, 4, 5, 6].map((h) => (
                          <div key={h} className="w-0.5 rounded-full bg-light-base/60" style={{ height: h }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* App content */}
                  <div className="px-4 py-3 space-y-3 bg-dark-base h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400">Good morning, James</p>
                        <p className="text-sm font-bold text-light-base">Portfolio Overview</p>
                      </div>
                      <div className="w-7 h-7 bg-red-primary/20 flex items-center justify-center">
                        <Bell size={12} className="text-red-primary" />
                      </div>
                    </div>

                    {/* Balance card */}
                    <div className="rounded bg-gradient-to-br from-red-primary to-red-secondary p-4">
                      <p className="text-[10px] text-dark-base/70 font-medium">Total Balance</p>
                      <p className="text-2xl font-black text-dark-base">$847,392</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp size={10} className="text-dark-base/70" />
                        <span className="text-[10px] font-semibold text-dark-base/70">+24.7% this month</span>
                      </div>
                    </div>

                    {/* Mini chart */}
                    <div className="rounded bg-dark-card p-3">
                      <svg viewBox="0 0 220 60" className="w-full h-10">
                                        <defs>
                          <linearGradient id="mobileGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,50 C20,45 35,40 55,35 C75,30 85,38 105,30 C125,22 135,18 155,12 C170,8 185,10 220,4 L220,60 L0,60 Z" fill="url(#mobileGrad)" />
                        <path d="M0,50 C20,45 35,40 55,35 C75,30 85,38 105,30 C125,22 135,18 155,12 C170,8 185,10 220,4" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="square" />
                      </svg>
                    </div>

                    {/* Top assets */}
                    {[
                      { sym: 'BTC', pct: '+1.77%', val: '$71,420' },
                      { sym: 'NVDA', pct: '+2.16%', val: '$892.17' },
                      { sym: 'AAPL', pct: '+1.08%', val: '$218.45' },
                    ].map((asset) => (
                      <div key={asset.sym} className="flex items-center justify-between py-1.5 border-b border-dark-border">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-primary/15 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-red-primary">{asset.sym.slice(0, 2)}</span>
                          </div>
                          <span className="text-[11px] font-bold text-light-base">{asset.sym}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-bold text-light-base">{asset.val}</p>
                          <p className="text-[9px] text-red-primary font-semibold">{asset.pct}</p>
                        </div>
                      </div>
                    ))}

                    {/* Bottom nav */}
                    <div className="flex justify-around pt-2">
                      {['Home', 'Markets', 'Trade', 'Portfolio'].map((item, idx) => (
                        <button key={item} className={`flex flex-col items-center gap-0.5 cursor-pointer ${idx === 0 ? 'text-red-primary' : 'text-slate-400'}`}>
                          <div className={`w-4 h-0.5 ${idx === 0 ? 'bg-red-primary' : 'bg-transparent'}`} />
                          <span className="text-[8px] font-medium">{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl bg-red-primary/10 blur-xl -z-10 scale-110" />
              </div>

              {/* Floating notification */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-8 top-16 bg-dark-card border border-dark-border rounded p-3 shadow-xl min-w-[140px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={12} className="text-red-primary" />
                  <span className="text-[9px] font-bold text-red-primary uppercase">Trade Executed</span>
                </div>
                <p className="text-[11px] font-bold text-light-base">Bought NVDA × 10</p>
                <p className="text-[9px] text-slate-400">$8,921.70 · 0.04s</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
