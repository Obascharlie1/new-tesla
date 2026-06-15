'use client'

import { motion } from 'framer-motion'
import { Lock, Shield, Fingerprint, Eye, Server, Globe } from 'lucide-react'
import { securityFeatures } from '@/data'
import { GlassCard } from '@/components/ui/GlassCard'

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  lock: Lock,
  shield: Shield,
  fingerprint: Fingerprint,
  eye: Eye,
  server: Server,
  globe: Globe,
}

const badges = [
  'SOC 2 Type II',
  'ISO 27001',
  'PCI DSS Level 1',
  'FINRA Member',
  'SEC Registered',
  'SIPC Member',
]

export function Security() {
  return (
    <section id="security" className="bg-light-surface/60 dark:bg-dark-surface/40 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4"
          >
            Security & Trust
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl lg:text-5xl font-bold text-dark-base dark:text-light-base tracking-tight mb-4"
          >
            Your capital, locked down
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Bank-grade infrastructure, independent audits, and full regulatory compliance — so you can trade hard and sleep easy.
          </motion.p>
        </div>

        {/* Security feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {securityFeatures.map((feature, i) => {
            const Icon = iconMap[feature.icon]
            return (
              <GlassCard key={feature.title} delay={i * 0.07} className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-brand-primary/[0.08] flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-brand-primary/70" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-dark-base dark:text-light-base mb-1">{feature.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </GlassCard>
            )
          })}
        </div>

        {/* Compliance badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded p-6 text-center"
        >
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5">
            Certifications & Compliance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {badges.map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-card text-xs font-semibold text-dark-base dark:text-light-base"
              >
                {badge}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
