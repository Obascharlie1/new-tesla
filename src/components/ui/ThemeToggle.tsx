'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-8 h-8 bg-light-border dark:bg-dark-border" />

  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      whileTap={{ scale: 0.95 }}
      className="w-8 h-8 flex items-center justify-center border border-light-border dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-orange-primary hover:text-orange-primary transition-colors duration-150 cursor-pointer"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span key="moon" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
            <Moon size={14} />
          </motion.span>
        ) : (
          <motion.span key="sun" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}>
            <Sun size={14} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
