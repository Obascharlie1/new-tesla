import { BTCChart } from '@/components/dashboard/BTCChart'

export function BTCSection() {
  return (
    <section className="bg-light-base dark:bg-dark-base py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <div className="flex items-center gap-2 mb-6">
          <span className="block w-6 h-px bg-red-primary" />
          <span className="text-xs font-semibold text-red-primary uppercase tracking-widest">Live Market</span>
        </div>

        <BTCChart />
      </div>
    </section>
  )
}
