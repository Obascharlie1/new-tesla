'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    await new Promise((res) => setTimeout(res, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="w-full max-w-sm">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-orange-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">Q</span>
        </div>
        <span className="font-bold text-dark-base dark:text-white text-base tracking-tight">Tesla Bridges Capital</span>
      </div>

      {submitted ? (
        /* Success state */
        <div className="text-center">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-dark-base dark:text-white mb-2">Check your email</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            We&apos;ve sent a password reset link to{' '}
            <span className="font-semibold text-dark-base dark:text-white">{email}</span>.
            Please check your inbox and follow the instructions.
          </p>
          <p className="text-xs text-slate-400 mb-6">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button
              onClick={() => { setSubmitted(false); setEmail('') }}
              className="text-orange-primary hover:text-orange-dim font-medium transition-colors"
            >
              try again
            </button>.
          </p>
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      ) : (
        /* Form state */
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-dark-base dark:text-white mb-1">Reset password</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-orange-primary/10 border border-orange-primary/30 text-orange-primary text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="john@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 border border-light-border dark:border-dark-border bg-light-base dark:bg-dark-card text-dark-base dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-orange-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-primary hover:bg-orange-dim disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex justify-center">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
