'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const { error: msg } = await res.json()
      setError(msg ?? 'Invalid credentials. Please check your email and password.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-light-surface dark:bg-dark-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-primary flex items-center justify-center mb-4">
            <Shield size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark-base dark:text-white tracking-tight">Admin Portal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tesla Capital — Restricted Access</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-light-base dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 space-y-4"
        >
          {error && (
            <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertCircle size={14} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@quantumvest.com"
              required
              className="w-full px-4 py-3 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 pr-11 py-3 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-brand-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-dim disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 text-sm transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
              : 'Sign In to Admin Panel'
            }
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5">
          Unauthorized access is strictly prohibited and monitored.
        </p>
      </div>
    </div>
  )
}
