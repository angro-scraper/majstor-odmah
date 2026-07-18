import { QrCode } from 'lucide-react'
import { PhoneFrame } from '@/components/phone-frame'
import { StoreButtons } from '@/components/store-buttons'
import { ServicesScreen } from '@/components/app-screens'

export function DownloadCta() {
  return (
    <section id="preuzmi" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[#1e40af] px-6 py-14 shadow-float sm:px-14 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-cyan-accent/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-10 size-72 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-7 text-primary-foreground">
            <h2 className="text-balance text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
              Ceo Balkan u jednoj aplikaciji
            </h2>
            <p className="max-w-md text-pretty text-lg leading-relaxed text-primary-foreground/90">
              Preuzmite balkan.works i pristupite svim uslugama, poslovima i
              plaćanjima — bilo gde u regionu.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <div className="flex size-28 items-center justify-center rounded-2xl bg-card p-3">
                <div className="grid size-full grid-cols-5 grid-rows-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <span
                      key={i}
                      className={`rounded-[2px] ${[0, 1, 4, 5, 6, 9, 12, 15, 18, 19, 20, 24].includes(i) ? 'bg-navy' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm text-primary-foreground/90">
                <span className="flex items-center gap-2 font-semibold">
                  <QrCode className="size-4" /> Skenirajte kod
                </span>
                <span className="max-w-[12rem] text-xs text-primary-foreground/70">
                  Usmerite kameru telefona ka kodu za brzo preuzimanje.
                </span>
              </div>
            </div>

            <StoreButtons className="[&_a:last-child]:border-white/20 [&_a:last-child]:bg-white [&_a:last-child]:text-navy" />
          </div>

          <div className="relative mx-auto hidden justify-center lg:flex">
            <PhoneFrame className="rotate-3">
              <ServicesScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
