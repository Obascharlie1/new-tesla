'use client'

import { useEffect, useState } from 'react'
import { Bitcoin, Building2, Wallet, Save, Loader2, CheckCircle } from 'lucide-react'

interface Config {
  btc_address:        string
  bank_name:          string
  bank_account_name:  string
  bank_account_number: string
  bank_sort_code:     string
  bank_swift:         string
  paypal_email:       string
}

type Section = 'btc' | 'bank' | 'paypal'

const DEFAULT: Config = {
  btc_address: '',
  bank_name: '',
  bank_account_name: '',
  bank_account_number: '',
  bank_sort_code: '',
  bank_swift: '',
  paypal_email: '',
}

function Field({ label, value, onChange, placeholder, mono = false }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  mono?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 text-sm bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-dark-base dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-primary transition-colors ${mono ? 'font-mono' : ''}`}
      />
    </div>
  )
}

export default function AdminSettingsPage() {
  const [config,  setConfig]  = useState<Config>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState<Section | null>(null)
  const [saved,   setSaved]   = useState<Section | null>(null)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch('/api/payment-config')
      .then(r => r.json())
      .then(d => { setConfig({ ...DEFAULT, ...d }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function save(section: Section, fields: Partial<Config>) {
    setSaving(section)
    setError('')
    try {
      const r = await fetch('/api/admin/payment-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!r.ok) {
        const { error: e } = await r.json()
        setError(e || 'Failed to save')
      } else {
        setSaved(section)
        setTimeout(() => setSaved(null), 2500)
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(null)
    }
  }

  function set(key: keyof Config) {
    return (v: string) => setConfig(prev => ({ ...prev, [key]: v }))
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 size={22} className="animate-spin text-brand-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-xl font-bold text-dark-base dark:text-white">Payment Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Update the deposit addresses and account details shown to users.
        </p>
      </div>

      {error && (
        <p className="text-sm text-brand-primary bg-brand-primary/10 border border-brand-primary/30 px-4 py-3">
          {error}
        </p>
      )}

      {/* Bitcoin */}
      <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2.5 mb-1">
          <Bitcoin size={18} className="text-amber-500" />
          <h2 className="text-sm font-bold text-dark-base dark:text-white">Bitcoin (BTC)</h2>
        </div>

        <Field
          label="Deposit Address"
          value={config.btc_address}
          onChange={set('btc_address')}
          placeholder="bc1q…"
          mono
        />

        <SaveButton
          section="btc"
          saving={saving}
          saved={saved}
          onSave={() => save('btc', { btc_address: config.btc_address })}
        />
      </div>

      {/* Bank Transfer */}
      <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2.5 mb-1">
          <Building2 size={18} className="text-blue-500" />
          <h2 className="text-sm font-bold text-dark-base dark:text-white">Bank Transfer</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Bank Name"       value={config.bank_name}           onChange={set('bank_name')}           placeholder="Chase Bank" />
          <Field label="Account Name"    value={config.bank_account_name}   onChange={set('bank_account_name')}   placeholder="Tesla Capital Ltd" />
          <Field label="Account Number"  value={config.bank_account_number} onChange={set('bank_account_number')} placeholder="4521 8847 3920 1547" mono />
          <Field label="Sort Code"       value={config.bank_sort_code}      onChange={set('bank_sort_code')}      placeholder="20-19-15" mono />
          <Field label="SWIFT / BIC"     value={config.bank_swift}          onChange={set('bank_swift')}          placeholder="CHASUS33" mono />
        </div>

        <SaveButton
          section="bank"
          saving={saving}
          saved={saved}
          onSave={() => save('bank', {
            bank_name:           config.bank_name,
            bank_account_name:   config.bank_account_name,
            bank_account_number: config.bank_account_number,
            bank_sort_code:      config.bank_sort_code,
            bank_swift:          config.bank_swift,
          })}
        />
      </div>

      {/* PayPal */}
      <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2.5 mb-1">
          <Wallet size={18} className="text-indigo-400" />
          <h2 className="text-sm font-bold text-dark-base dark:text-white">PayPal</h2>
        </div>

        <Field
          label="PayPal Email"
          value={config.paypal_email}
          onChange={set('paypal_email')}
          placeholder="payments@example.com"
        />

        <SaveButton
          section="paypal"
          saving={saving}
          saved={saved}
          onSave={() => save('paypal', { paypal_email: config.paypal_email })}
        />
      </div>
    </div>
  )
}

function SaveButton({ section, saving, saved, onSave }: {
  section: Section
  saving: Section | null
  saved: Section | null
  onSave: () => void
}) {
  const isSaving = saving === section
  const isSaved  = saved  === section

  return (
    <div className="flex justify-end pt-1">
      <button
        onClick={onSave}
        disabled={isSaving}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-dim disabled:opacity-60 transition-colors"
      >
        {isSaving ? (
          <><Loader2 size={13} className="animate-spin" /> Saving…</>
        ) : isSaved ? (
          <><CheckCircle size={13} /> Saved</>
        ) : (
          <><Save size={13} /> Save</>
        )}
      </button>
    </div>
  )
}
