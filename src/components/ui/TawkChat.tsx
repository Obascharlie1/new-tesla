'use client'

import { useEffect } from 'react'

export function TawkChat() {
  useEffect(() => {
    const w = window as any
    if (w.chaport) return

    w.chaportConfig = { appId: '6a1f77074dab3ead5e840604' }

    const v3: any = {}
    w.chaport = v3
    v3._q = []
    v3._l = {}
    v3.q  = function (...args: any[]) { v3._q.push(args) }
    v3.on = function (e: string, fn: any) {
      if (!v3._l[e]) v3._l[e] = []
      v3._l[e].push(fn)
    }

    const s  = document.createElement('script')
    s.type   = 'text/javascript'
    s.async  = true
    s.src    = 'https://app.chaport.com/javascripts/insert.js'
    const ss = document.getElementsByTagName('script')[0]
    ss.parentNode?.insertBefore(s, ss)
  }, [])

  return null
}
