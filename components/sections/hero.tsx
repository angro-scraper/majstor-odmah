import Link from 'next/link'
import { Sparkles, ArrowRight, Star, Briefcase, UtensilsCrossed } from 'lucide-react'
import { PhoneFrame } from '@/components/phone-frame'
import { StoreButtons } from '@/components/store-buttons'
import { HomeScreen, WalletScreen } from '@/components/app-screens'

const STATS = [
  { value: '1.2M+', label: 'korisnika' },
  { value: '45.000+', label: 'pružalaca usluga' },
  { value: '8', label: 'zemalja Balkana' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 to-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-40 size-80 rounded-full bg-cyan-accent/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-32 lg:px-8">
        <div className="flex flex-col items-start gap-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft">
            <Sparkles className="size-3.5" />
            Super aplikacija za Balkan
          </span>

          <h1 className="text-balance text-[2.5rem] font-bold leading-[1.04] tracking-tight text-navy sm:text-5xl lg:text-[4rem]">
            Sve usluge na jednom mestu
          </h1>

          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Jedna aplikacija za svakodnevni život i poslovanje širom Balkana.
            Poslovi, majstori, dostava, putovanja, zdravlje i novčanik — sve na
            dohvat ruke.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/preuzmi"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform hover:-translate-y-0.5"
            >
              Preuzmi aplikaciju
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/usluge"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-primary"
            >
              Istraži usluge
            </Link>
          </div>

          <StoreButtons />

          <dl className="mt-3 flex flex-wrap gap-x-12 gap-y-5 border-t border-border pt-7">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-2xl font-bold text-navy sm:text-3xl">{s.value}</dt>
                <dd className="mt-0.5 text-sm text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto flex items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 mx-auto my-auto size-[28rem] rounded-full bg-gradient-to-br from-primary/15 to-cyan-accent/15 blur-2xl"
          />
          <div className="flex items-end gap-4">
            <PhoneFrame className="hidden translate-y-6 sm:block">
              <WalletScreen />
            </PhoneFrame>
            <PhoneFrame className="-translate-y-2">
              <HomeScreen />
            </PhoneFrame>
          </div>

          <div className="absolute -left-2 top-8 hidden rotate-[-4deg] items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-card lg:flex">
            <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
              <Briefcase className="size-4" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-navy">Novi posao</span>
              <span className="block text-[10px] text-muted-foreground">Front-end Developer</span>
            </span>
          </div>

          <div className="absolute -right-2 bottom-10 hidden rotate-[4deg] items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-card lg:flex">
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-turquoise">
              <UtensilsCrossed className="size-4" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-navy">Dostava stiže</span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Star className="size-3 fill-current text-amber-400" /> 4.9 · 25 min
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
