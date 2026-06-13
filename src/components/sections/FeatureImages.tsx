import Image from 'next/image'

export function FeatureImages() {
  return (
    <section className="bg-dark-base py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Handshake */}
          <div className="relative overflow-hidden rounded-xl aspect-video">
            <Image
              src="/images/team-handshake.jpg"
              alt="Tesla Capital partners — building trusted investor relationships"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 text-sm font-semibold text-white/90">
              Trusted partnerships worldwide
            </p>
          </div>

          {/* Skyscraper */}
          <div className="relative overflow-hidden rounded-xl aspect-video">
            <Image
              src="/images/skyscraper.jpg"
              alt="Institutional-grade financial infrastructure"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 text-sm font-semibold text-white/90">
              Institutional-grade infrastructure
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
