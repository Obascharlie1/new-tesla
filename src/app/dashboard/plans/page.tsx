'use client'

import { useState, useEffect } from 'react'
import { Check, X, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { plans } from '@/data'
import { TopBar } from '@/components/dashboard/TopBar'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const planExtras: Record<string, { roi: string; minInvestment: string }> = {
  Starter:  { roi: 'Est. 2–4% monthly returns',   minInvestment: '$100'    },
  Silver:   { roi: 'Est. 5–7% monthly returns',   minInvestment: '$1,000'  },
  Gold:     { roi: 'Est. 8–12% monthly returns',  minInvestment: '$5,000'  },
  Platinum: { roi: 'Est. 15–20% monthly returns', minInvestment: '$25,000' },
}

export default function PlansPage() {
  const [currentPlan, setCurrentPlan]   = useState<string>('None')
  const [userId,      setUserId]        = useState<string | null>(null)
  const [loading,     setLoading]       = useState(true)
  const [showModal,   setShowModal]     = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [saving,      setSaving]        = useState(false)
  const [saveError,   setSaveError]     = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
      setCurrentPlan(data?.plan ?? 'None')
      setLoading(false)
    }
    load()
  }, [])

  function openModal(planName: string) {
    setSelectedPlan(planName)
    setSaveError('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setSelectedPlan(null)
    setSaveError('')
  }

  async function confirmSwitch() {
    if (!selectedPlan || !userId) return
    setSaving(true)
    setSaveError('')

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ plan: selectedPlan })
      .eq('id', userId)

    if (error) {
      setSaveError(error.message)
      setSaving(false)
      return
    }

    setCurrentPlan(selectedPlan)
    setSaving(false)
    closeModal()
  }

  const selectedPlanData = plans.find(p => p.name === selectedPlan)

  if (loading) {
    return (
      <div>
        <TopBar title="Investment Plans" subtitle="Manage your investment tier" />
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin text-red-primary" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <TopBar title="Investment Plans" subtitle="Manage your investment tier" />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {plans.map(plan => {
            const isCurrent  = plan.name === currentPlan
            const extras     = planExtras[plan.name]
            const planIdx    = plans.findIndex(p => p.name === plan.name)
            const curIdx     = plans.findIndex(p => p.name === currentPlan)
            const isUpgrade  = planIdx > curIdx
            const isDowngrade = planIdx < curIdx

            return (
              <div
                key={plan.name}
                className={cn(
                  'relative bg-light-base dark:bg-dark-card border rounded-xl p-6 transition-all duration-300',
                  isCurrent
                    ? 'border-red-primary shadow-lg shadow-red-primary/10'
                    : 'border-light-border dark:border-dark-border'
                )}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      <Check size={10} strokeWidth={3} /> Current Plan
                    </span>
                  </div>
                )}

                {plan.highlighted && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-primary text-white text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles size={10} /> Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={cn(
                    'text-sm font-bold uppercase tracking-widest mb-1',
                    isCurrent ? 'text-red-primary' : 'text-slate-500 dark:text-slate-400'
                  )}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    {plan.price === 0 ? (
                      <span className="text-3xl font-bold text-dark-base dark:text-white">Free</span>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-dark-base dark:text-white">$</span>
                        <span className="text-3xl font-bold text-dark-base dark:text-white">{plan.price}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">/mo</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-4 px-3 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
                  <p className="text-[11px] font-semibold text-red-primary">{extras.roi}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Min. investment: <span className="font-semibold text-dark-base dark:text-white">{extras.minInvestment}</span>
                  </p>
                </div>

                <div className={cn(
                  'h-px mb-4',
                  isCurrent
                    ? 'bg-gradient-to-r from-red-primary/0 via-red-primary/40 to-red-primary/0'
                    : 'bg-light-border dark:bg-dark-border'
                )} />

                <ul className="space-y-2 mb-5">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className={cn(
                        'mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0',
                        isCurrent ? 'bg-red-primary text-white' : 'bg-red-primary/15 text-red-primary'
                      )}>
                        <Check size={10} strokeWidth={3} />
                      </span>
                      <span className="text-dark-base dark:text-white leading-snug text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button disabled className="w-full border border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold py-2.5 text-sm cursor-not-allowed opacity-80">
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => openModal(plan.name)}
                    className="w-full border border-light-border dark:border-dark-border text-dark-base dark:text-white hover:border-red-primary hover:text-red-primary font-bold py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {isUpgrade ? 'Upgrade' : isDowngrade ? 'Downgrade' : 'Switch'}
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8">
          Plan changes take effect immediately. Cancel anytime.
        </p>
      </div>

      {/* Confirmation modal */}
      {showModal && selectedPlanData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-base/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <button onClick={closeModal} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-dark-base dark:hover:text-white transition-colors">
              <X size={16} />
            </button>

            <h3 className="text-base font-bold text-dark-base dark:text-white mb-1">Switch to {selectedPlanData.name}?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Moving from <span className="font-semibold text-dark-base dark:text-white">{currentPlan}</span> to{' '}
              <span className="font-semibold text-dark-base dark:text-white">{selectedPlanData.name}</span>.
            </p>

            <div className="p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border mb-5">
              <div className="flex items-baseline gap-1 mb-1">
                {selectedPlanData.price === 0 ? (
                  <span className="text-xl font-bold text-dark-base dark:text-white">Free</span>
                ) : (
                  <>
                    <span className="text-lg font-bold text-dark-base dark:text-white">${selectedPlanData.price}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/month</span>
                  </>
                )}
              </div>
              <p className="text-xs text-red-primary font-semibold">{planExtras[selectedPlanData.name].roi}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Min. investment: <span className="font-semibold text-dark-base dark:text-white">{planExtras[selectedPlanData.name].minInvestment}</span>
              </p>
            </div>

            {saveError && (
              <p className="text-xs text-red-primary mb-3">{saveError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={saving}
                className="flex-1 border border-light-border dark:border-dark-border text-dark-base dark:text-white font-semibold py-2.5 text-sm hover:border-slate-400 dark:hover:border-slate-500 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                disabled={saving}
                className="flex-1 bg-red-primary hover:bg-red-dim disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Confirm Switch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
