import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body.message
    if (!message?.text) return NextResponse.json({ ok: true })

    // Must be a reply to another message
    const replyTo = message.reply_to_message
    if (!replyTo) return NextResponse.json({ ok: true })

    const telegramMessageId = replyTo.message_id
    const replyText = message.text.trim()
    const admin = createAdminClient()

    // Look up which user this Telegram message belongs to
    const { data: original } = await admin
      .from('messages')
      .select('user_id')
      .eq('telegram_message_id', telegramMessageId)
      .single()

    if (!original?.user_id) return NextResponse.json({ ok: true })

    // Save admin reply to DB
    await admin.from('messages').insert({
      user_id: original.user_id,
      sender:  'admin',
      content: replyText,
      read:    false,
    })

    // Send confirmation back to Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: message.chat.id,
        text: '✅ Reply delivered to user.',
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Telegram webhook error:', err)
    return NextResponse.json({ ok: true })
  }
}
