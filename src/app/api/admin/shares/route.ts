import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  return token === process.env.ADMIN_API_SECRET
}

// GET /api/admin/shares?userId=xxx — returns grouped holdings for a user
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('user_shares')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Aggregate by symbol
  const map: Record<string, {
    symbol: string
    name: string
    total_quantity: number
    total_invested: number
    total_profit: number
  }> = {}
  for (const row of (data ?? [])) {
    if (!map[row.symbol]) {
      map[row.symbol] = { symbol: row.symbol, name: row.name, total_quantity: 0, total_invested: 0, total_profit: 0 }
    }
    map[row.symbol].total_quantity += Number(row.quantity)
    map[row.symbol].total_invested += Number(row.purchase_amount)
    map[row.symbol].total_profit   += Number(row.profit ?? 0)
  }

  return NextResponse.json({ data: Object.values(map) })
}

// PATCH /api/admin/shares — set profit for a user's symbol, adjust profiles.profit
export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId, symbol, profit } = await request.json()
  if (!userId || !symbol || profit === undefined) {
    return NextResponse.json({ error: 'userId, symbol and profit are required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Get current rows for this user + symbol
  const { data: rows, error: fetchErr } = await admin
    .from('user_shares')
    .select('id, profit')
    .eq('user_id', userId)
    .eq('symbol', symbol)

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400 })
  if (!rows || rows.length === 0) return NextResponse.json({ error: 'No holdings found' }, { status: 404 })

  const oldTotalProfit = rows.reduce((s, r) => s + Number(r.profit ?? 0), 0)
  const newProfit = Number(profit)
  const delta = newProfit - oldTotalProfit

  // Store all profit on the first (most recent) row, zero out others
  const updates = rows.map((r, i) => admin
    .from('user_shares')
    .update({ profit: i === 0 ? newProfit : 0 })
    .eq('id', r.id)
  )
  await Promise.all(updates)

  // Adjust profiles.profit by the delta
  if (delta !== 0) {
    const { data: profile } = await admin
      .from('profiles')
      .select('profit')
      .eq('id', userId)
      .single()

    if (profile) {
      await admin
        .from('profiles')
        .update({ profit: Number(profile.profit ?? 0) + delta })
        .eq('id', userId)
    }
  }

  return NextResponse.json({ success: true, delta })
}
