import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  return token === process.env.ADMIN_API_SECRET
}

export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()

  const allowed = [
    'btc_address',
    'bank_name',
    'bank_account_name',
    'bank_account_number',
    'bank_sort_code',
    'bank_swift',
    'paypal_email',
  ]

  const updates: Record<string, string> = {}
  for (const key of allowed) {
    if (typeof body[key] === 'string') updates[key] = body[key].trim()
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('payment_config')
    .upsert({ id: 1, ...updates })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
