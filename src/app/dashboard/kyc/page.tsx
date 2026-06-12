'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { TopBar } from '@/components/dashboard/TopBar'
import { Upload, CheckCircle, FileText, ArrowLeft, Shield, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type DocType = 'passport' | 'drivers_license' | 'national_id'

interface UploadedFile {
  name: string
  size: string
  file: File
}

const docTypes: { value: DocType; label: string; desc: string }[] = [
  { value: 'passport',        label: 'Passport',          desc: 'International passport — any country' },
  { value: 'drivers_license', label: "Driver's License",  desc: 'Valid government-issued license' },
  { value: 'national_id',     label: 'National ID Card',  desc: 'Government-issued national identity card' },
]

const docTypeLabels: Record<DocType, string> = {
  passport:        'Passport',
  drivers_license: "Driver's License",
  national_id:     'National ID',
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileUploadArea({ label, file, onFile }: { label: string; file: UploadedFile | null; onFile: (f: UploadedFile) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onFile({ name: f.name, size: formatSize(f.size), file: f })
  }
  return (
    <div>
      <p className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-2">{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full border-2 border-dashed transition-colors p-6 text-center ${
          file ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' : 'border-light-border dark:border-dark-border hover:border-orange-primary hover:bg-orange-primary/5'
        }`}
      >
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-dark-base dark:text-white truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{file.size}</p>
            </div>
          </div>
        ) : (
          <div>
            <Upload size={24} className="mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-medium text-dark-base dark:text-white">Click to upload</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG, PNG or PDF · Max 10 MB</p>
          </div>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleChange} />
    </div>
  )
}

export default function KYCPage() {
  const [docType,   setDocType]   = useState<DocType>('passport')
  const [frontFile, setFrontFile] = useState<UploadedFile | null>(null)
  const [backFile,  setBackFile]  = useState<UploadedFile | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [userId,    setUserId]    = useState<string | null>(null)
  const [kycStatus, setKycStatus] = useState<string>('None')
  const [fetchingStatus, setFetchingStatus] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase.from('profiles').select('kyc_status').eq('id', user.id).single()
      setKycStatus(data?.kyc_status ?? 'None')
      setFetchingStatus(false)
    }
    load()
  }, [])

  const needsBack = docType !== 'passport'
  const canSubmit = frontFile !== null && (!needsBack || backFile !== null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || !userId) return
    setLoading(true)
    setError('')

    const supabase = createClient()

    // Upload front document
    const frontExt  = frontFile!.file.name.split('.').pop()
    const frontPath = `${userId}/front.${frontExt}`
    const { error: frontErr } = await supabase.storage
      .from('kyc-documents')
      .upload(frontPath, frontFile!.file, { upsert: true })

    if (frontErr) {
      setError(`Upload failed: ${frontErr.message}`)
      setLoading(false)
      return
    }

    // Upload back document (if required)
    let backPath: string | null = null
    if (needsBack && backFile) {
      const backExt = backFile.file.name.split('.').pop()
      backPath = `${userId}/back.${backExt}`
      const { error: backErr } = await supabase.storage
        .from('kyc-documents')
        .upload(backPath, backFile.file, { upsert: true })

      if (backErr) {
        setError('Failed to upload back document. Please try again.')
        setLoading(false)
        return
      }
    }

    // Update profile with file paths and status
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({
        kyc_status:       'Pending',
        kyc_doc_type:     docTypeLabels[docType],
        kyc_submitted_at: new Date().toISOString(),
        kyc_front_url:    frontPath,
        kyc_back_url:     backPath,
      })
      .eq('id', userId)

    if (updateErr) {
      setError(updateErr.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setSubmitted(true)
  }

  if (fetchingStatus) {
    return (
      <div>
        <TopBar title="KYC Verification" />
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin text-orange-primary" />
        </div>
      </div>
    )
  }

  // Already verified
  if (kycStatus === 'Verified') {
    return (
      <div>
        <TopBar title="KYC Verification" />
        <div className="p-6 max-w-lg mx-auto mt-12 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-dark-base dark:text-white mb-2">Identity Verified</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Your identity has been successfully verified. You have full access to all platform features.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-primary text-white font-bold text-sm hover:bg-orange-dim transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Already pending
  if (kycStatus === 'Pending' && !submitted) {
    return (
      <div>
        <TopBar title="KYC Verification" />
        <div className="p-6 max-w-lg mx-auto mt-12 text-center">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-5">
            <Shield size={32} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-dark-base dark:text-white mb-2">Verification Pending</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Your documents are under review. We&apos;ll notify you within <strong className="text-dark-base dark:text-white">24–48 hours</strong> once verification is complete.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-primary text-white font-bold text-sm hover:bg-orange-dim transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div>
        <TopBar title="KYC Verification" />
        <div className="p-6 max-w-lg mx-auto mt-12 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-dark-base dark:text-white mb-2">Documents Submitted</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Your identity documents are under review. We&apos;ll notify you within{' '}
            <strong className="text-dark-base dark:text-white">24–48 hours</strong> once verification is complete.
          </p>
          <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border p-4 mb-6 text-left space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText size={14} className="text-slate-400" />
              <span className="text-dark-base dark:text-white font-medium">{frontFile?.name}</span>
              <span className="text-slate-500 dark:text-slate-400 text-xs ml-auto">{frontFile?.size}</span>
            </div>
            {backFile && (
              <div className="flex items-center gap-2 text-sm">
                <FileText size={14} className="text-slate-400" />
                <span className="text-dark-base dark:text-white font-medium">{backFile.name}</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs ml-auto">{backFile.size}</span>
              </div>
            )}
          </div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-primary text-white font-bold text-sm hover:bg-orange-dim transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <TopBar title="KYC Verification" subtitle="Upload your identity document to verify your account" />
      <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-dark-base dark:hover:text-white transition-colors">
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>

        <div className="flex gap-3 p-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
          <Shield size={18} className="text-orange-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-dark-base dark:text-white">Why we need this</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              KYC verification is required by financial regulations to protect your account and enable full withdrawal access.
            </p>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 bg-orange-primary/10 border border-orange-primary/30 text-orange-primary text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="block text-xs font-semibold text-dark-base dark:text-white uppercase tracking-wider mb-3">Select Document Type</p>
            <div className="space-y-2">
              {docTypes.map(dt => (
                <label
                  key={dt.value}
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    docType === dt.value ? 'border-orange-primary bg-orange-primary/5' : 'border-light-border dark:border-dark-border hover:border-orange-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="docType"
                    value={dt.value}
                    checked={docType === dt.value}
                    onChange={() => { setDocType(dt.value); setFrontFile(null); setBackFile(null) }}
                    className="mt-0.5 accent-orange-primary flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-dark-base dark:text-white">{dt.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{dt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <FileUploadArea
              label={needsBack ? 'Front of Document' : 'Document Photo / Scan'}
              file={frontFile}
              onFile={setFrontFile}
            />
            {needsBack && (
              <FileUploadArea label="Back of Document" file={backFile} onFile={setBackFile} />
            )}
          </div>

          <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border p-4">
            <p className="text-xs font-semibold text-dark-base dark:text-white mb-2">Document Requirements</p>
            <ul className="space-y-1">
              {[
                'Document must be valid and not expired',
                'All four corners must be visible',
                'Text must be clearly legible — no blur',
                'Accepted: JPG, PNG, PDF (max 10 MB)',
              ].map(req => (
                <li key={req} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="w-1 h-1 bg-orange-primary flex-shrink-0 mt-1.5" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full bg-orange-primary hover:bg-orange-dim disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
              : 'Submit for Verification'
            }
          </button>
        </form>
      </div>
    </div>
  )
}
