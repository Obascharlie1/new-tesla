'use client'

import { useEffect, useState, useCallback } from 'react'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function MessagesBell() {
  const [unread, setUnread] = useState(0)

  const fetchUnread = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('sender', 'admin')
      .eq('read', false)
    setUnread(count ?? 0)
  }, [])

  useEffect(() => {
    fetchUnread()
    const id = setInterval(fetchUnread, 15_000)
    return () => clearInterval(id)
  }, [fetchUnread])

  return (
    <Link
      href="/dashboard/messages"
      className="relative w-9 h-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-dark-base dark:hover:text-white transition-colors"
      aria-label="Messages"
    >
      <MessageCircle size={20} />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-orange-primary text-white text-[9px] font-bold">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  )
}
