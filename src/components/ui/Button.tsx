'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold tracking-tight rounded-lg transition-all duration-150 cursor-pointer select-none'

  const variants = {
    primary: 'bg-orange-primary text-white hover:bg-orange-dim border border-orange-primary',
    secondary: 'bg-dark-base text-white dark:bg-white dark:text-dark-base border border-dark-base dark:border-white hover:opacity-80',
    ghost: 'text-slate-500 hover:text-dark-base dark:hover:text-white border border-transparent hover:bg-light-surface dark:hover:bg-dark-card',
    outline: 'border border-light-border dark:border-dark-border text-dark-base dark:text-white hover:border-orange-primary hover:text-orange-primary bg-transparent',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(base, variants[variant], sizes[size], className)}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  )
}
