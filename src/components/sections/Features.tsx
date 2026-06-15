'use client'

import { motion } from 'framer-motion'
import { Brain, PieChart, Activity, Zap, Shield, Globe } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { features } from '@/data'

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  brain: Brain,
  pieChart: PieChart,
  activity: Activity,
  zap: Zap,
  shield: Shield,
  globe: Globe,
}

export function Features() {
  return (
    <section id="features" className="bg-light-base/70 dark:bg-dark-base/40 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4"
          >
            The Arsenal
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl lg:text-5xl font-bold text-dark-base dark:text-light-base tracking-tight mb-4"
          >
            Built to{' '}
            win the trade
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Six weapons that used to live on hedge-fund desks — now in your hands, firing at retail-friendly fees.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon]
            return (
              <GlassCard
                key={feature.title}
                delay={i * 0.07}
                className="p-6 group cursor-default"
              >
                {/* Icon */}
                <div className="w-11 h-11 bg-brand-primary/[0.08] flex items-center justify-center mb-4 group-hover:bg-brand-primary/15 transition-colors duration-300">
                  <Icon size={20} className="text-brand-primary/70" />
                </div>

                {/* Tag */}
                <span className="inline-block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3 bg-white/[0.06] px-2 py-0.5">
                  {feature.tag}
                </span>

                <h3 className="text-base font-bold text-dark-base dark:text-light-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-5 h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </GlassCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
