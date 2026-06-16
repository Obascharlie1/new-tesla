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

      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-sm text-slate-500 mb-6">
          Select a deposit method below. Funds are reflected in your account balance once confirmed.
        </p>

        <div className="space-y-3">
          {methods.map((method) => (
            <Link
              key={method.href}
              href={method.href}
              className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 hover:bg-slate-50 dark:hover:bg-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 transition-all group flex items-center gap-4"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                <method.icon size={20} className="text-slate-700 dark:text-white" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{method.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{method.description}</p>
              </div>

              {/* Arrow */}
              <ChevronRight
                size={18}
                className="text-slate-500 group-hover:text-slate-900 dark:hover:text-white flex-shrink-0 transition-colors"
              />
            </Link>
          ))}
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-xl">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-900 dark:text-white">Minimum deposit:</span> $100 across all methods.
            All deposits are secured with 256-bit AES encryption and are FDIC-insured up to $500,000.
          </p>
        </div>
      </div>
    </div>
  )
}
