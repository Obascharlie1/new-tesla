'use client'

import { motion } from 'framer-motion'
import { UserPlus, CreditCard, TrendingUp } from 'lucide-react'
import { howItWorksSteps } from '@/data'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  userPlus: UserPlus,
  creditCard: CreditCard,
  trendingUp: TrendingUp,
}

export function HowItWorks() {
  return (
    <section className="bg-light-base dark:bg-dark-base py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-semibold tracking-widest text-orange-primary uppercase mb-4"
          >
            Get Started
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl lg:text-5xl font-bold text-dark-base dark:text-light-base tracking-tight mb-4"
          >
            Up and running in{' '}
            <span className="gradient-text">minutes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Three simple steps separate you from institutional-grade portfolio management.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Connector line — desktop */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ transformOrigin: 'left' }}
              className="h-full bg-gradient-to-r from-orange-primary/40 via-orange-primary to-orange-primary/40"
            />
          </div>

          {howItWorksSteps.map((step, i) => {
            const Icon = iconMap[step.icon]
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.15 }}
                className="relative text-center"
              >
                {/* Step number + icon */}
                <div className="relative inline-flex flex-col items-center mb-6">
                  <div className="w-18 h-18 border border-orange-primary/30 flex items-center justify-center relative">
                    <div className="w-14 h-14 bg-orange-primary/10 dark:bg-orange-primary/15 flex items-center justify-center">
                      <Icon size={24} className="text-orange-primary" />
                    </div>
                    <div className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-orange-primary flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{i + 1}</span>
                    </div>
                  </div>
                </div>

                <div className="max-w-xs mx-auto">
                  <span className="text-[10px] font-bold text-orange-primary tracking-widest uppercase mb-2 block">
                    Step {step.step}
                  </span>
                  <h3 className="text-xl font-bold text-dark-base dark:text-light-base mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Button size="lg">
            Create Free Account
            <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
