'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight, TrendingUp, TrendingDown, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'

const liveMetrics = [
  { label: 'S&P 500', value: '5,842.31', change: '+0.84%', up: true },
  { label: 'BTC/USD', value: '$71,420', change: '+1.77%', up: true },
  { label: 'NVDA', value: '$892.17', change: '+2.16%', up: true },
  { label: 'VIX', value: '14.32', change: '-3.21%', up: false },
  { label: 'GOLD', value: '$2,341', change: '+0.43%', up: true },
  { label: 'EUR/USD', value: '1.0842', change: '-0.12%', up: false },
  { label: 'ETH/USD', value: '$3,847', change: '+2.38%', up: true },
  { label: 'TSLA', value: '$248.91', change: '-2.15%', up: false },
]

// ── Headline "arrange" animation ─────────────────────────────
const headlineContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
}
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

function arrangeWords(text: string, className = '') {
  return text.split(' ').map((word, i) => (
    <motion.span key={i} variants={headlineWord} className={`inline-block ${className}`}>
      {word}&nbsp;
    </motion.span>
  ))
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* ── Full-bleed trading video background ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/skyscraper.jpg"
      >
        <source src="/trading-bg.mp4" type="video/mp4" />
      </video>

      {/* Cinematic overlays — dark vignette + brand wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-base/85 via-dark-base/75 to-dark-base" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-base/90 via-transparent to-dark-base/40" />
      <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full bg-brand-primary/[0.10] blur-[160px] pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#E0241C 1px, transparent 1px), linear-gradient(90deg, #E0241C 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Left accent rail */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-primary/60 to-transparent hidden lg:block" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-10 text-center">

        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-1.5 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-slate-200">
            AI-native trading · markets are live now
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={headlineContainer}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-white leading-[0.98] tracking-tight mb-6"
        >
          {arrangeWords('Trade with an')}
          <br className="hidden sm:block" />
          {arrangeWords('unfair', 'text-brand-primary')}
          {arrangeWords('advantage.')}
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Real-time AI signals, sub-50ms execution, and automated risk control —
          the firepower of an institutional desk, in one terminal you actually own.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4 }}
          className="flex flex-col xs:flex-row sm:flex-row gap-3 items-center justify-center mb-10"
        >
          <Link
            href="/auth/register"
            className="group inline-flex items-center justify-center gap-2 font-bold tracking-tight rounded-full px-8 py-4 text-base bg-brand-primary text-white hover:bg-brand-dim transition-all duration-150 shadow-lg shadow-brand-primary/25"
          >
            Start Trading Free
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="#how"
            className="inline-flex items-center justify-center gap-2 font-bold tracking-tight rounded-full px-8 py-4 text-base border border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-150"
          >
            See How It Works
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400"
        >
          <span className="flex items-center gap-1.5"><Zap size={13} className="text-brand-primary" /> Sub-50ms fills</span>
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-brand-primary" /> SEC &amp; FINRA regulated</span>
          <span className="flex items-center gap-1.5"><TrendingUp size={13} className="text-brand-primary" /> 10.4M traders onboard</span>
        </motion.div>
      </div>

      {/* ── Live market ticker strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative z-10 border-y border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden"
      >
        <div className="flex animate-ticker whitespace-nowrap py-3">
          {[...liveMetrics, ...liveMetrics].map((m, i) => (
            <div key={i} className="flex items-center gap-2 px-6 flex-shrink-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
              <span className="text-[11px] font-mono font-bold text-white">{m.value}</span>
              <span className={`text-[11px] font-bold flex items-center gap-0.5 ${m.up ? 'text-emerald-400' : 'text-brand-secondary'}`}>
                {m.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {m.change}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
