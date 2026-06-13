import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(request: NextRequest) {
  return request.cookies.get('admin_token')?.value === process.env.ADMIN_API_SECRET
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const path = request.nextUrl.searchParams.get('path')
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin.storage
    .from('transaction-receipts')
    .createSignedUrl(path, 60 * 10) // 10-minute signed URL

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? 'Could not generate URL' }, { status: 400 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
