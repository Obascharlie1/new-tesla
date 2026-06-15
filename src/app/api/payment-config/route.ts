import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('payment_config')
    .select('*')
    .eq('id', 1)
    .single()

  if (error || !data) {
    // Return sensible defaults if the table doesn't exist yet
    return NextResponse.json({
      btc_address: '',
      bank_name: '',
      bank_account_name: '',
      bank_account_number: '',
      bank_sort_code: '',
      bank_swift: '',
      paypal_email: '',
    })
  }

  return NextResponse.json(data)
}
