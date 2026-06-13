import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-light-base dark:bg-dark-base">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-[480px] flex-col bg-dark-base relative overflow-hidden flex-shrink-0">
        {/* Red grid pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.05,
            backgroundImage: `
              linear-gradient(#E0241C 1px, transparent 1px),
              linear-gradient(90deg, #E0241C 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <Link href="/" className="flex items-center mb-auto">
            <Image
              src="/images/logo.png"
              alt="Tesla Capital"
              width={356}
              height={22}
              className="h-7 w-auto brightness-0 invert"
            />
          </Link>

          {/* Headline */}
          <div className="mb-auto">
            <h2 className="text-3xl font-bold text-white leading-tight mb-6">
              Institutional-grade investing tools for everyone.
            </h2>

            {/* Stats row */}
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold text-white">$48B+</p>
                <p className="text-xs text-slate-400 mt-0.5">Assets Managed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">98.3%</p>
                <p className="text-xs text-slate-400 mt-0.5">Uptime SLA</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">140+</p>
                <p className="text-xs text-slate-400 mt-0.5">Countries</p>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-xs text-slate-500 mt-12">
            &copy; {new Date().getFullYear()} BIT-TESLA. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right: form area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-light-base dark:bg-dark-base overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
