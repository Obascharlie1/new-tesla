'use client'

import { motion } from 'framer-motion'

const row1 = [
  { id: '1560250097-0b93528c311a', name: 'James Carter',   role: 'Portfolio Manager'  },
  { id: '1573496359142-b8d87734a5a2', name: 'Rachel Stone',   role: 'Senior Analyst'     },
  { id: '1519085360753-af0119f7cbe7', name: 'Daniel Reed',    role: 'Equity Trader'      },
  { id: '1472099645785-5658abf4ff4e', name: 'Mark Evans',     role: 'Hedge Fund Manager' },
  { id: '1600880292203-757bb62b4baf', name: 'Sophia Grant',   role: 'Investment Advisor' },
  { id: '1551836022-deb4988cc6c0',   name: 'Chris Walker',   role: 'Risk Analyst'       },
  { id: '1507679799987-c73779587ccf', name: 'Tom Harrington', role: 'FX Strategist'      },
]

const row2 = [
  { id: '1580489944761-15a19d654956', name: 'Laura Bennett',  role: 'Wealth Manager'     },
  { id: '1570295999919-56ceb5ecca61', name: 'Emma Clarke',    role: 'Quant Researcher'   },
  { id: '1556761175-5973dc0f32e7',   name: 'David Morgan',   role: 'Chief Economist'    },
  { id: '1531746020798-e6953c6e8e04', name: 'Paul Hughes',    role: 'Market Strategist'  },
  { id: '1544005313-94ddf0286df2',   name: 'Anna Fischer',   role: 'ETF Specialist'     },
  { id: '1438761681033-6461ffad8d80', name: 'Lisa Turner',    role: 'Options Trader'     },
  { id: '1535713875002-d1d0cf377fde', name: 'Oliver Hayes',   role: 'Derivatives Desk'   },
]

function PersonCard({ id, name, role }: { id: string; name: string; role: string }) {
  return (
    <div className="flex-shrink-0 w-44 mx-2.5 rounded-xl overflow-hidden bg-light-surface dark:bg-dark-card border border-light-border dark:border-dark-border">
      <div className="w-full h-48 overflow-hidden">
        <img
          src={`https://images.unsplash.com/photo-${id}?w=200&h=220&fit=crop&crop=face`}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="px-3 py-2.5">
        <p className="text-xs font-bold text-dark-base dark:text-white truncate">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{role}</p>
      </div>
    </div>
  )
}

function InfiniteRow({
  people,
  direction = 'left',
}: {
  people: { id: string; name: string; role: string }[]
  direction?: 'left' | 'right'
}) {
  const doubled = [...people, ...people]
  const sign = direction === 'left' ? '-' : ''

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex"
        animate={{ x: direction === 'left' ? [0, `-${50}%`] : [`-${50}%`, 0] }}
        transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
      >
        {doubled.map((p, i) => (
          <PersonCard key={`${p.id}-${i}`} {...p} />
        ))}
      </motion.div>
    </div>
  )
}

export function PeopleSlideshow() {
  return (
    <section className="bg-light-base dark:bg-dark-base py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-primary mb-3">
          Our Community
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-dark-base dark:text-white">
          Trusted by traders worldwide
        </h2>
      </div>

      <div className="space-y-4">
        <InfiniteRow people={row1} direction="left" />
        <InfiniteRow people={row2} direction="right" />
      </div>
    </section>
  )
}
