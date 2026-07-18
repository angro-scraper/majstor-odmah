'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight, Star, Briefcase, UtensilsCrossed } from 'lucide-react'
import { PhoneFrame } from '@/components/phone-frame'
import { StoreButtons } from '@/components/store-buttons'
import { HomeScreen, WalletScreen } from '@/components/app-screens'
import { useI18n } from '@/lib/i18n/context'

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 to-background">
      <div
        aria-hidden="true"
        className="bg-grid bg-grid-fade pointer-events-none absolute inset-0"
      />
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
            {t.hero.badge}
          </span>

          <h1 className="text-balance text-[2.5rem] font-bold leading-[1.04] tracking-tight text-navy sm:text-5xl lg:text-[4rem]">
            {t.hero.title}
          </h1>

          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/preuzmi"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform hover:-translate-y-0.5"
            >
              {t.cta.download}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/usluge"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-primary"
            >
              {t.nav.services}
            </Link>
          </div>

          <StoreButtons />

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {['#2563eb', '#06b6d4', '#14b8a6', '#1e40af'].map((c) => (
                <span
                  key={c}
                  className="size-8 rounded-full border-2 border-background"
                  style={{ backgroundColor: c }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-sm font-semibold text-navy">
                <Star className="size-3.5 fill-current text-amber-400" />
                4.9 / 5 · 38.000+ ocena
              </span>
              <span className="text-xs text-muted-foreground">Prosečna ocena na App Store i Google Play</span>
            </div>
          </div>
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
