'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize',
  'Benin','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria',
  'Burkina Faso','Cambodia','Cameroon','Canada','Chile','China','Colombia','Congo',
  'Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Estonia','Ethiopia','Finland','France','Georgia',
  'Germany','Ghana','Greece','Guatemala','Guinea','Haiti','Honduras','Hungary','Iceland',
  'India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan',
  'Kazakhstan','Kenya','Kuwait','Kyrgyzstan','Latvia','Lebanon','Libya','Lithuania',
  'Luxembourg','Malaysia','Maldives','Mali','Malta','Mexico','Moldova','Monaco','Mongolia',
  'Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nepal','Netherlands',
  'New Zealand','Nicaragua','Niger','Nigeria','North Korea','Norway','Oman','Pakistan',
  'Palestine','Panama','Paraguay','Peru','Philippines','Poland','Portugal','Qatar',
  'Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia','Sierra Leone','Singapore',
  'Slovakia','Slovenia','Somalia','South Africa','South Korea','South Sudan','Spain',
  'Sri Lanka','Sudan','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania',
  'Thailand','Togo','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Uganda',
  'Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
  'Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']

const inputCls = 'w-full px-4 py-3 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-red-primary transition-colors'
const labelCls = 'block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2'

type Step = 1 | 2

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)

  /* ── form state ── */
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    gender: '', dateOfBirth: '', country: '', state: '', address: '', phone: '',
  })
  const [showPw,      setShowPw]      = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [terms,       setTerms]       = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [errors,      setErrors]      = useState<Record<string, string>>({})

  function update(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
    setErrors(p => ({ ...p, [field]: '' }))
  }

  /* ── validation ── */
  function validateStep1() {
    const e: Record<string, string> = {}
    if (!form.fullName.trim())   e.fullName        = 'Full name is required.'
    if (!form.email.trim())      e.email           = 'Email is required.'
    if (form.password.length < 8) e.password       = 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
    return e
  }

  function validateStep2() {
    const e: Record<string, string> = {}
    if (!form.gender)          e.gender      = 'Please select a gender.'
    if (!form.dateOfBirth)     e.dateOfBirth = 'Date of birth is required.'
    if (!form.country)         e.country     = 'Please select a country.'
    if (!form.phone.trim())    e.phone       = 'Phone number is required.'
    if (!terms)                e.terms       = 'You must accept the terms.'
    return e
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateStep1()
    setErrors(errs)
    if (Object.keys(errs).length === 0) setStep(2)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateStep2()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setError('')
    setLoading(true)

    const supabase = createClient()

    const { data, error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    })

    if (authErr) { setError(authErr.message); setLoading(false); return }

    // Update profile with personal details (trigger already created the row)
    if (data.user) {
      await supabase.from('profiles').update({
        gender:        form.gender,
        date_of_birth: form.dateOfBirth,
        country:       form.country,
        state:         form.state,
        address:       form.address,
        phone:         form.phone,
      }).eq('id', data.user.id)
    }

    router.push('/dashboard')
    router.refresh()
  }

  /* ── step indicator ── */
  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2] as Step[]).map(s => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full transition-colors ${
            step > s
              ? 'bg-emerald-500 text-white'
              : step === s
              ? 'bg-red-primary text-white'
              : 'bg-light-surface dark:bg-dark-card text-slate-400 border border-light-border dark:border-dark-border'
          }`}>
            {step > s ? <Check size={12} /> : s}
          </div>
          <span className={`text-xs font-medium ${step === s ? 'text-dark-base dark:text-white' : 'text-slate-400'}`}>
            {s === 1 ? 'Account' : 'Personal Details'}
          </span>
          {s < 2 && <div className="w-8 h-px bg-light-border dark:bg-dark-border" />}
        </div>
      ))}
    </div>
  )

  return (
    <div className="w-full max-w-sm">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-red-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">Q</span>
        </div>
        <span className="font-bold text-dark-base dark:text-white text-base tracking-tight">QuantumVest</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-base dark:text-white mb-1">Create account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Start your investment journey today</p>
      </div>

      <StepIndicator />

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-primary/10 border border-red-primary/30 text-red-primary text-sm">
          {error}
        </div>
      )}

      {/* ── STEP 1: Account credentials ── */}
      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-5">
          <div>
            <label className={labelCls}>Full Name</label>
            <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)}
              placeholder="John Doe" autoComplete="name" className={inputCls} />
            {errors.fullName && <p className="mt-1 text-xs text-red-primary">{errors.fullName}</p>}
          </div>

          <div>
            <label className={labelCls}>Email Address</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
              placeholder="john@example.com" autoComplete="email" className={inputCls} />
            {errors.email && <p className="mt-1 text-xs text-red-primary">{errors.email}</p>}
          </div>

          <div>
            <label className={labelCls}>Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="Min. 8 characters" autoComplete="new-password"
                className={`${inputCls} pr-11`} />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-primary">{errors.password}</p>}
          </div>

          <div>
            <label className={labelCls}>Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                placeholder="Re-enter password" autoComplete="new-password"
                className={`${inputCls} pr-11`} />
              <button type="button" onClick={() => setShowConfirm(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-primary">{errors.confirmPassword}</p>}
          </div>

          <button type="submit"
            className="w-full bg-red-primary hover:bg-red-dim text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2">
            Continue <ArrowRight size={16} />
          </button>
        </form>
      )}

      {/* ── STEP 2: Personal details ── */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Gender */}
          <div>
            <label className={labelCls}>Gender</label>
            <select value={form.gender} onChange={e => update('gender', e.target.value)} className={inputCls}>
              <option value="">Select gender</option>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.gender && <p className="mt-1 text-xs text-red-primary">{errors.gender}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelCls}>Date of Birth</label>
            <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={inputCls} />
            {errors.dateOfBirth && <p className="mt-1 text-xs text-red-primary">{errors.dateOfBirth}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls}>Phone Number</label>
            <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
              placeholder="+1 (555) 000-0000" autoComplete="tel" className={inputCls} />
            {errors.phone && <p className="mt-1 text-xs text-red-primary">{errors.phone}</p>}
          </div>

          {/* Country */}
          <div>
            <label className={labelCls}>Country</label>
            <select value={form.country} onChange={e => update('country', e.target.value)} className={inputCls}>
              <option value="">Select country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.country && <p className="mt-1 text-xs text-red-primary">{errors.country}</p>}
          </div>

          {/* State */}
          <div>
            <label className={labelCls}>State / Province <span className="normal-case font-normal text-slate-400">(optional)</span></label>
            <input type="text" value={form.state} onChange={e => update('state', e.target.value)}
              placeholder="e.g. California" className={inputCls} />
          </div>

          {/* Address */}
          <div>
            <label className={labelCls}>Address <span className="normal-case font-normal text-slate-400">(optional)</span></label>
            <input type="text" value={form.address} onChange={e => update('address', e.target.value)}
              placeholder="Street address" autoComplete="street-address" className={inputCls} />
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={terms}
                onChange={e => { setTerms(e.target.checked); setErrors(p => ({ ...p, terms: '' })) }}
                className="mt-0.5 w-4 h-4 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card accent-red-primary flex-shrink-0" />
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                I agree to the <Link href="#" className="text-red-primary hover:text-red-dim font-medium">Terms of Service</Link> and <Link href="#" className="text-red-primary hover:text-red-dim font-medium">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <p className="mt-1 text-xs text-red-primary">{errors.terms}</p>}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="flex items-center justify-center gap-2 px-5 py-3.5 border border-light-border dark:border-dark-border text-sm font-semibold text-dark-base dark:text-white hover:border-red-primary hover:text-red-primary transition-colors">
              <ArrowLeft size={15} />
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-red-primary hover:bg-red-dim disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-red-primary hover:text-red-dim font-medium transition-colors">Sign in</Link>
      </p>
    </div>
  )
}
