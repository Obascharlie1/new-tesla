import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('user_shares')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { symbol, name, quantity, purchasePrice, purchaseAmount } = await request.json()

  if (!symbol || !name || !quantity || !purchasePrice || !purchaseAmount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (quantity <= 0 || purchaseAmount <= 0) {
    return NextResponse.json({ error: 'Quantity and amount must be positive' }, { status: 400 })
  }

  // Check user's profit balance
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('profit')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 400 })
  }

  if (profile.profit < purchaseAmount) {
    return NextResponse.json({ error: 'Insufficient profit balance' }, { status: 400 })
  }

  // Insert share purchase
  const { data, error: insertError } = await supabase
    .from('user_shares')
    .insert({
      user_id: user.id,
      symbol,
      name,
      quantity,
      purchase_price: purchasePrice,
      purchase_amount: purchaseAmount,
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 })

  // Deduct from profit
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ profit: profile.profit - purchaseAmount })
    .eq('id', user.id)

  if (updateError) {
    console.error('Failed to update profit after share purchase:', updateError.message)
  }

  // Record in transactions history so it shows on the transactions page
  await supabase.from('transactions').insert({
    user_id: user.id,
    type: 'Share Purchase',
    amount: purchaseAmount,
    method: 'Shares',
    note: `${quantity.toFixed(4)} shares of ${symbol} @ $${purchasePrice.toFixed(2)}`,
    status: 'Completed',
  })

  return NextResponse.json({ success: true, data })
}
