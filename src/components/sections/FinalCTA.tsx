'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function FinalCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="bg-light-base dark:bg-dark-base py-24 lg:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-orange-primary/6 dark:bg-orange-primary/8 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Label */}
          <span className="inline-block text-xs font-semibold tracking-widest text-orange-primary uppercase mb-6">
            Start Today
          </span>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-base dark:text-light-base tracking-tight leading-tight mb-6">
            Join 10 million investors
            <br />
            <span className="gradient-text">building real wealth</span>
          </h2>

          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto">
            Create your free account in 2 minutes. No credit card, no commitments — just smarter investing from day one.
          </p>

          {/* Email form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3.5 border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-card text-dark-base dark:text-light-base placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm focus:outline-none focus:border-orange-primary transition-all duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-orange-primary text-white font-bold text-sm cursor-pointer hover:bg-orange-dim transition-colors duration-200 whitespace-nowrap"
              >
                Get Started Free
                <ArrowRight size={16} />
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-4 mb-6"
            >
              <CheckCircle size={20} className="text-orange-primary" />
              <span className="text-base font-semibold text-dark-base dark:text-light-base">
                You&apos;re on the list — check your inbox.
              </span>
            </motion.div>
          )}

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            {[
              'No credit card required',
              '14-day free trial',
              'Cancel anytime',
              'Bank-grade security',
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-orange-primary" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
