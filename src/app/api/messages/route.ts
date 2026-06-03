import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function notifyTelegram(userId: string, content: string) {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!token || !chatId) return

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('full_name, email').eq('id', userId).single()
  const name = profile?.full_name || profile?.email || 'Unknown User'

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `💬 New message from ${name}\n🆔 ${userId}\n\n${content}\n\nReply to THIS message to respond to the user.`,
    }),
  })
}

// GET — user fetches their conversation
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Mark all admin messages as read when user opens inbox
  await supabase.from('messages').update({ read: true }).eq('user_id', user.id).eq('sender', 'admin').eq('read', false)

  return NextResponse.json({ data: data ?? [] })
}

// POST — user sends a reply
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('messages')
    .insert({ user_id: user.id, sender: 'user', content: content.trim(), read: false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Forward to Telegram (fire and forget)
  notifyTelegram(user.id, content.trim()).catch(() => {})

  return NextResponse.json({ data })
}
