'use client'

import Link from 'next/link'
import { Landmark, CircleDollarSign, CreditCard, ChevronRight } from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'

const methods = [
  {
    href: '/dashboard/deposit/bank',
    icon: Landmark,
    label: 'Bank Transfer',
    description: '0–3 business days · No fee',
    detail: 'Transfer directly from your bank account. Most secure method.',
  },
  {
    href: '/dashboard/deposit/bitcoin',
    icon: CircleDollarSign,
    label: 'Bitcoin',
    description: 'Instant · Network fee applies',
    detail: 'Deposit using Bitcoin (BTC). Requires 3 blockchain confirmations.',
  },
  {
    href: '/dashboard/deposit/paypal',
    icon: CreditCard,
    label: 'PayPal',
    description: 'Instant · 2.9% fee',
    detail: 'Send funds via PayPal. Available in 200+ countries.',
  },
]

export default function DepositPage() {
  return (
    <div>
      <TopBar title="Deposit Funds" subtitle="Choose your preferred deposit method" />

      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Select a deposit method below. Funds are reflected in your account balance once confirmed.
        </p>

        <div className="space-y-3">
          {methods.map((method) => (
            <Link
              key={method.href}
              href={method.href}
              className="flex items-center gap-5 p-6 bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl hover:border-red-primary transition-all group"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-red-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-primary/15 transition-colors">
                <method.icon size={22} className="text-red-primary" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-dark-base dark:text-white text-sm">{method.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{method.description}</p>
                <p className="text-xs text-slate-400 mt-1 hidden sm:block">{method.detail}</p>
              </div>

              {/* Arrow */}
              <ChevronRight
                size={18}
                className="text-slate-400 group-hover:text-red-primary flex-shrink-0 transition-colors"
              />
            </Link>
          ))}
        </div>

        <div className="mt-8 p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="font-semibold text-dark-base dark:text-white">Minimum deposit:</span> $100 across all methods.
            All deposits are secured with 256-bit AES encryption and are FDIC-insured up to $500,000.
          </p>
        </div>
      </div>
    </div>
  )
}
