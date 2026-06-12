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
    <section id="features" className="bg-light-base dark:bg-dark-base py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-semibold tracking-widest text-orange-primary uppercase mb-4"
          >
            Platform Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl lg:text-5xl font-bold text-dark-base dark:text-light-base tracking-tight mb-4"
          >
            Everything you need to{' '}
            <span className="gradient-text">outperform</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Six powerful capabilities — formerly reserved for hedge funds and institutional desks — now accessible to every investor.
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
                <div className="w-11 h-11 bg-orange-primary/10 dark:bg-orange-primary/15 flex items-center justify-center mb-4 group-hover:bg-orange-primary/20 transition-colors duration-300">
                  <Icon size={20} className="text-orange-primary" />
                </div>

                {/* Tag */}
                <span className="inline-block text-[10px] font-bold tracking-widest text-orange-primary uppercase mb-3 bg-orange-primary/10 px-2 py-0.5">
                  {feature.tag}
                </span>

                <h3 className="text-base font-bold text-dark-base dark:text-light-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-5 h-px bg-gradient-to-r from-orange-primary/0 via-orange-primary/40 to-orange-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </GlassCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
