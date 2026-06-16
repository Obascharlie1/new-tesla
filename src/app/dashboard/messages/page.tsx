'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { Send, Loader2, MessageCircle, ShieldCheck } from 'lucide-react'

interface Message {
  id: string
  sender: 'admin' | 'user'
  content: string
  read: boolean
  created_at: string
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function groupByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = []
  messages.forEach(msg => {
    const d = new Date(msg.created_at)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === d.toDateString()
    const label = isToday ? 'Today' : isYesterday ? 'Yesterday' : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    const last = groups[groups.length - 1]
    if (!last || last.date !== label) groups.push({ date: label, messages: [msg] })
    else last.messages.push(msg)
  })
  return groups
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading,  setLoading]  = useState(true)
  const [input,    setInput]    = useState('')
  const [sending,  setSending]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    const res = await fetch('/api/messages')
    if (res.ok) {
      const { data } = await res.json()
      setMessages(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMessages()
    const id = setInterval(fetchMessages, 10_000)
    return () => clearInterval(id)
  }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return
    setSending(true)
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input.trim() }),
    })
    if (res.ok) {
      const { data } = await res.json()
      setMessages(prev => [...prev, data])
      setInput('')
    }
    setSending(false)
  }

  const groups = groupByDate(messages)

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#0A0A0A]">
      <TopBar title="Messages" subtitle="Support &amp; Admin Chat" />

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl w-full mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={24} className="animate-spin text-slate-400 dark:text-white" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-white/5 flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-slate-700 dark:text-white" />
            </div>
            <p className="text-sm font-bold text-dark-base dark:text-white mb-1">No messages yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Send us a message and our support team will get back to you shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map(group => (
              <div key={group.date}>
                {/* Date divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-slate-100 dark:bg-white/[0.06]" />
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-[#444] uppercase tracking-widest px-2">
                    {group.date}
                  </span>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-white/[0.06]" />
                </div>

                <div className="space-y-2">
                  {group.messages.map((msg, i) => {
                    const isUser  = msg.sender === 'user'
                    const isAdmin = msg.sender === 'admin'
                    const prev    = group.messages[i - 1]
                    const showAvatar = isAdmin && (!prev || prev.sender !== 'admin')

                    return (
                      <div key={msg.id} className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>

                        {/* Admin avatar */}
                        {isAdmin && (
                          <div className={`flex-shrink-0 mb-0.5 ${showAvatar ? 'visible' : 'invisible'}`}>
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center shadow-sm">
                              <ShieldCheck size={14} className="text-slate-700 dark:text-white" />
                            </div>
                          </div>
                        )}

                        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[72%]`}>
                          {/* Sender label (first in group) */}
                          {showAvatar && (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                              Support
                            </p>
                          )}

                          {/* Bubble */}
                          <div className={`relative px-4 py-3 shadow-sm ${
                            isUser
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-black rounded-2xl rounded-tr-sm'
                              : 'bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-white rounded-2xl rounded-tl-sm'
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          </div>

                          {/* Timestamp */}
                          <p className={`text-[10px] mt-1 mx-1 ${isUser ? 'text-slate-400' : 'text-slate-400'}`}>
                            {formatTime(msg.created_at)}
                          </p>
                        </div>

                        {/* User avatar spacer */}
                        {isUser && <div className="w-2 flex-shrink-0" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="bg-white dark:bg-[#0A0A0A] border-t border-slate-200 dark:border-white/[0.08] px-4 py-3">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 px-4 py-3 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-400 dark:focus:border-white/30 transition-colors placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="h-11 px-5 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-black text-sm font-semibold rounded-full transition-colors flex-shrink-0 shadow-sm"
          >
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            <span>{sending ? 'Sending…' : 'Send'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
