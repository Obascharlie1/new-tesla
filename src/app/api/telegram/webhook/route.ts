import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Telegram webhook body:', JSON.stringify(body))

    const message = body.message
    if (!message?.text) return NextResponse.json({ ok: true })

    // Only handle replies to forwarded user messages
    const replyTo = message.reply_to_message
    if (!replyTo?.text) {
      console.log('No reply_to_message found')
      return NextResponse.json({ ok: true })
    }

    console.log('Reply to text:', replyTo.text)

    // Extract user ID embedded in the original forwarded message
    const match = replyTo.text.match(/🆔\s*([a-f0-9-]{36})/i)
    if (!match) {
      console.log('No user ID found in:', replyTo.text)
      return NextResponse.json({ ok: true })
    }

    const userId  = match[1]
    const content = message.text.trim()
    const admin   = createAdminClient()

    // Save admin reply to DB
    await admin.from('messages').insert({
      user_id: userId,
      sender:  'admin',
      content,
      read:    false,
    })

    // Confirm delivery back to Telegram
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: message.chat.id,
        text: '✅ Reply delivered to user.',
      }),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
