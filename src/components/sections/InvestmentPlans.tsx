'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles, ArrowRight } from 'lucide-react'
import { plans } from '@/data'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function InvestmentPlans() {
  return (
    <section id="pricing" className="bg-light-surface dark:bg-dark-surface py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-semibold tracking-widest text-orange-primary uppercase mb-4"
          >
            Investment Plans
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl lg:text-5xl font-bold text-dark-base dark:text-light-base tracking-tight mb-4"
          >
            Simple, transparent{' '}
            <span className="gradient-text">pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            No hidden fees. No commissions. Start free and scale as your portfolio grows.
          </motion.p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={cn(
                'relative rounded p-6 transition-all duration-300',
                plan.highlighted
                  ? 'glass-card ring-2 ring-orange-primary shadow-2xl shadow-orange-primary/20 scale-[1.02] z-10'
                  : 'glass-card'
              )}
            >
              {/* Best value badge */}
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-primary text-white text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles size={10} />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5">
                <h3 className={cn(
                  'text-sm font-bold uppercase tracking-widest mb-1',
                  plan.highlighted ? 'text-orange-primary' : 'text-slate-500 dark:text-slate-400'
                )}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold text-dark-base dark:text-light-base">Free</span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-dark-base dark:text-light-base">$</span>
                      <span className="text-4xl font-bold text-dark-base dark:text-light-base">{plan.price}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">/mo</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{plan.description}</p>
              </div>

              {/* Divider */}
              <div className={cn(
                'h-px mb-5',
                plan.highlighted
                  ? 'bg-gradient-to-r from-orange-primary/0 via-orange-primary/50 to-orange-primary/0'
                  : 'bg-light-border dark:bg-dark-border'
              )} />

              {/* Features */}
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <span className={cn(
                      'mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0',
                      plan.highlighted
                        ? 'bg-orange-primary text-dark-base'
                        : 'bg-orange-primary/15 text-orange-primary'
                    )}>
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span className="text-dark-base dark:text-light-base leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.highlighted ? 'primary' : 'outline'}
                size="md"
                className="w-full"
              >
                {plan.cta}
                <ArrowRight size={15} />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-500 dark:text-slate-400 mt-10"
        >
          All plans include a 14-day free trial. No credit card required. Cancel anytime.
        </motion.p>
      </div>
    </section>
  )
}
