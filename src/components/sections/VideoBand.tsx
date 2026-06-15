'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const bandStats = [
  { value: '<50ms', label: 'Average fill time' },
  { value: '140+', label: 'Markets covered' },
  { value: '99.97%', label: 'Execution uptime' },
]

export function VideoBand() {
  return (
    <section className="relative py-28 lg:py-40 overflow-hidden">
      {/* Trading UI video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/images/skyscraper.jpg"
      >
        <source src="/trading-ui.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-dark-base/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-base via-dark-base/70 to-transparent" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-brand-primary/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-semibold tracking-widest text-brand-primary uppercase mb-5"
          >
            The Execution Layer
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.03] mb-6"
          >
            When the market moves,
            <br />
            <span className="text-brand-primary">you&apos;re already filled.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300 leading-relaxed mb-10"
          >
            Co-located infrastructure, smart order routing, and a matching engine
            tuned for the millisecond. While the crowd is still clicking, your order
            is already done.
          </motion.p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10 max-w-lg">
            {bandStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="border-l-2 border-brand-primary/40 pl-4"
              >
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{s.value}</p>
                <p className="text-xs text-slate-400 mt-1 leading-snug">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2 font-bold tracking-tight rounded-full px-7 py-3.5 text-base bg-white text-black hover:bg-slate-100 transition-all duration-150"
            >
              Open Your Desk
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
