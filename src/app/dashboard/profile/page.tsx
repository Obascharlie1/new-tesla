'use client'

import { useState, useEffect } from 'react'
import { Loader2, Edit2, Check, X, ShieldCheck, ShieldAlert, ShieldOff } from 'lucide-react'
import { TopBar } from '@/components/dashboard/TopBar'

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

interface Profile {
  full_name:     string
  email:         string
  gender:        string
  date_of_birth: string
  phone:         string
  country:       string
  state:         string
  address:       string
  plan:          string
  kyc_status:    string
  balance:       number
  profit:        number
  created_at:    string
}

const inputCls = 'w-full px-4 py-2.5 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white text-sm focus:outline-none focus:border-orange-primary transition-colors placeholder:text-slate-400'
const selectCls = inputCls
const labelCls = 'block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
      <div className="px-5 py-4 border-b border-light-border dark:border-dark-border">
        <h2 className="text-sm font-bold text-dark-base dark:text-white">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export default function ProfilePage() {
  const [profile,  setProfile]  = useState<Profile | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState('')
  const [editing,  setEditing]  = useState(false)
  const [form,     setForm]     = useState<Partial<Profile>>({})

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(({ data }) => {
        setProfile(data)
        setForm(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function update(field: string, value: string) {
    setForm(p => ({ ...p, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name:     form.full_name,
        gender:        form.gender,
        date_of_birth: form.date_of_birth,
        phone:         form.phone,
        country:       form.country,
        state:         form.state,
        address:       form.address,
      }),
    })
    if (res.ok) {
      const { data } = await res.json()
      setProfile(p => ({ ...p!, ...data }))
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      const { error: e } = await res.json()
      setError(e ?? 'Failed to save. Please try again.')
    }
    setSaving(false)
  }

  function handleCancel() {
    setForm(profile ?? {})
    setEditing(false)
    setError('')
  }

  if (loading) {
    return (
      <div>
        <TopBar title="Profile" subtitle="Your account details" />
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin text-orange-primary" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div>
        <TopBar title="Profile" />
        <div className="p-6 text-sm text-slate-500">Could not load profile.</div>
      </div>
    )
  }

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : profile.email.slice(0, 2).toUpperCase()

  const kycColor = profile.kyc_status === 'Verified'
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
    : profile.kyc_status === 'Pending'
    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
    : 'text-slate-500 bg-light-surface dark:bg-dark-surface'

  return (
    <div>
      <TopBar title="Profile" subtitle="Manage your personal information" />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5 pb-16">

        {/* Avatar + name block */}
        <div className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-primary flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-dark-base dark:text-white truncate">{profile.full_name || '—'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${kycColor}`}>
                {profile.kyc_status === 'Verified' ? <ShieldCheck size={11} /> : profile.kyc_status === 'Pending' ? <ShieldAlert size={11} /> : <ShieldOff size={11} />}
                KYC {profile.kyc_status}
              </span>
              {profile.plan && profile.plan !== 'None' && (
                <span className="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30">
                  {profile.plan}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => editing ? handleCancel() : setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-light-border dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-orange-primary hover:text-orange-primary transition-colors flex-shrink-0"
          >
            {editing ? <><X size={13} /> Cancel</> : <><Edit2 size={13} /> Edit</>}
          </button>
        </div>

        {/* Success / error banners */}
        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
            <Check size={15} /> Profile updated successfully.
          </div>
        )}
        {error && (
          <div className="px-4 py-3 bg-orange-primary/10 border border-orange-primary/30 text-orange-primary text-sm">{error}</div>
        )}

        {/* Personal Info */}
        <Section title="Personal Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name</label>
              {editing ? (
                <input type="text" value={form.full_name ?? ''} onChange={e => update('full_name', e.target.value)} className={inputCls} placeholder="Full name" />
              ) : (
                <p className="text-sm text-dark-base dark:text-white">{profile.full_name || '—'}</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Gender</label>
              {editing ? (
                <select value={form.gender ?? ''} onChange={e => update('gender', e.target.value)} className={selectCls}>
                  <option value="">Select gender</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              ) : (
                <p className="text-sm text-dark-base dark:text-white">{profile.gender || '—'}</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Date of Birth</label>
              {editing ? (
                <input type="date" value={form.date_of_birth ?? ''} onChange={e => update('date_of_birth', e.target.value)}
                  max={new Date().toISOString().split('T')[0]} className={inputCls} />
              ) : (
                <p className="text-sm text-dark-base dark:text-white">
                  {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls}>Phone Number</label>
              {editing ? (
                <input type="tel" value={form.phone ?? ''} onChange={e => update('phone', e.target.value)} className={inputCls} placeholder="+1 (555) 000-0000" />
              ) : (
                <p className="text-sm text-dark-base dark:text-white">{profile.phone || '—'}</p>
              )}
            </div>
          </div>
        </Section>

        {/* Location */}
        <Section title="Location">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Country</label>
              {editing ? (
                <select value={form.country ?? ''} onChange={e => update('country', e.target.value)} className={selectCls}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <p className="text-sm text-dark-base dark:text-white">{profile.country || '—'}</p>
              )}
            </div>

            <div>
              <label className={labelCls}>State / Province</label>
              {editing ? (
                <input type="text" value={form.state ?? ''} onChange={e => update('state', e.target.value)} className={inputCls} placeholder="e.g. California" />
              ) : (
                <p className="text-sm text-dark-base dark:text-white">{profile.state || '—'}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Address</label>
              {editing ? (
                <input type="text" value={form.address ?? ''} onChange={e => update('address', e.target.value)} className={inputCls} placeholder="Street address" />
              ) : (
                <p className="text-sm text-dark-base dark:text-white">{profile.address || '—'}</p>
              )}
            </div>
          </div>
        </Section>

        {/* Account */}
        <Section title="Account">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Email Address</label>
              <p className="text-sm text-dark-base dark:text-white">{profile.email}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Contact support to change email</p>
            </div>
            <div>
              <label className={labelCls}>Member Since</label>
              <p className="text-sm text-dark-base dark:text-white">
                {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div>
              <label className={labelCls}>Active Plan</label>
              <p className="text-sm font-semibold text-dark-base dark:text-white">{profile.plan || 'None'}</p>
            </div>
            <div>
              <label className={labelCls}>KYC Status</label>
              <p className={`text-sm font-semibold ${
                profile.kyc_status === 'Verified' ? 'text-emerald-600 dark:text-emerald-400' :
                profile.kyc_status === 'Pending'  ? 'text-amber-600 dark:text-amber-400' :
                'text-slate-500 dark:text-slate-400'
              }`}>{profile.kyc_status}</p>
            </div>
          </div>
        </Section>

        {/* Save button */}
        {editing && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-orange-primary hover:bg-orange-dim disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Check size={16} /> Save Changes</>}
          </button>
        )}

      </div>
    </div>
  )
}
