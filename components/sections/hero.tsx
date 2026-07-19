'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, Building2, CheckCircle2, Handshake, Sparkles, UsersRound } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

const platformCopy = {
  sr: { badge: 'Regionalna digitalna platforma', title: 'Lokalna ekonomija, povezana na jednom mestu', subtitle: 'Balkan.works povezuje korisnike, firme i partnere kroz proverene profile, lokalnu vidljivost i alate za rast.', explore: 'Istraži platformu', business: 'Za kompanije', customers: 'Korisnici', businesses: 'Firme', partners: 'Partneri' },
  hr: { badge: 'Regionalna digitalna platforma', title: 'Lokalno gospodarstvo, povezano na jednom mjestu', subtitle: 'Balkan.works povezuje korisnike, tvrtke i partnere kroz provjerene profile, lokalnu vidljivost i alate za rast.', explore: 'Istraži platformu', business: 'Za tvrtke', customers: 'Korisnici', businesses: 'Tvrtke', partners: 'Partneri' },
  bs: { badge: 'Regionalna digitalna platforma', title: 'Lokalna ekonomija, povezana na jednom mjestu', subtitle: 'Balkan.works povezuje korisnike, firme i partnere kroz provjerene profile, lokalnu vidljivost i alate za rast.', explore: 'Istraži platformu', business: 'Za kompanije', customers: 'Korisnici', businesses: 'Firme', partners: 'Partneri' },
  cnr: { badge: 'Regionalna digitalna platforma', title: 'Lokalna ekonomija, povezana na jednom mjestu', subtitle: 'Balkan.works povezuje korisnike, firme i partnere kroz provjerene profile, lokalnu vidljivost i alate za rast.', explore: 'Istraži platformu', business: 'Za kompanije', customers: 'Korisnici', businesses: 'Firme', partners: 'Partneri' },
  mk: { badge: 'Регионална дигитална платформа', title: 'Локалната економија, поврзана на едно место', subtitle: 'Balkan.works ги поврзува корисниците, компаниите и партнерите преку проверени профили, локална видливост и алатки за раст.', explore: 'Истражи ја платформата', business: 'За компании', customers: 'Корисници', businesses: 'Компании', partners: 'Партнери' },
  sl: { badge: 'Regionalna digitalna platforma', title: 'Lokalno gospodarstvo, povezano na enem mestu', subtitle: 'Balkan.works povezuje uporabnike, podjetja in partnerje prek preverjenih profilov, lokalne vidnosti in orodij za rast.', explore: 'Raziščite platformo', business: 'Za podjetja', customers: 'Uporabniki', businesses: 'Podjetja', partners: 'Partnerji' },
  sq: { badge: 'Platformë digjitale rajonale', title: 'Ekonomia lokale, e lidhur në një vend', subtitle: 'Balkan.works lidh përdoruesit, bizneset dhe partnerët përmes profileve të verifikuara, dukshmërisë lokale dhe mjeteve për rritje.', explore: 'Eksploro platformën', business: 'Për bizneset', customers: 'Përdorues', businesses: 'Biznese', partners: 'Partnerë' },
  en: { badge: 'Regional digital platform', title: 'The local economy, connected in one place', subtitle: 'Balkan.works connects customers, businesses and partners through verified profiles, local visibility and tools for growth.', explore: 'Explore platform', business: 'For businesses', customers: 'Customers', businesses: 'Businesses', partners: 'Partners' },
  bg: { badge: 'Регионална дигитална платформа', title: 'Местната икономика, свързана на едно място', subtitle: 'Balkan.works свързва потребители, бизнеси и партньори чрез проверени профили, местна видимост и инструменти за растеж.', explore: 'Разгледайте платформата', business: 'За бизнеса', customers: 'Потребители', businesses: 'Бизнеси', partners: 'Партньори' },
} as const

export function Hero() {
  const { locale, t } = useI18n()
  const copy = platformCopy[locale]

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
            {copy.badge}
          </span>

          <h1 className="text-balance text-[2.5rem] font-bold leading-[1.04] tracking-tight text-navy sm:text-5xl lg:text-[4rem]">
            {copy.title}
          </h1>

          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {copy.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/platforma"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform hover:-translate-y-0.5"
            >
              {copy.explore}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/za-kompanije"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-primary"
            >
              {copy.business}
            </Link>
          </div>

          <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><CheckCircle2 className="size-4 text-turquoise" /> {t.security.title}</p>
        </div>

        <div className="relative mx-auto flex items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 mx-auto my-auto size-[28rem] rounded-full bg-gradient-to-br from-primary/15 to-cyan-accent/15 blur-2xl"
          />
          <div className="w-full max-w-xl rounded-[2rem] border border-border bg-card p-5 shadow-card sm:p-7">
            <div className="flex items-center justify-between border-b border-border pb-4"><span className="flex items-center gap-2 text-sm font-bold text-navy"><BarChart3 className="size-4 text-primary" /> balkan.works</span><span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-turquoise">{t.cta.getStarted}</span></div>
            <div className="mt-5 grid grid-cols-3 gap-3">{[[UsersRound, copy.customers, t.categories.description], [Building2, copy.businesses, t.business.features[0].title], [Handshake, copy.partners, t.trust.label]].map(([Icon, label, text]) => { const CardIcon = Icon as typeof UsersRound; return <div key={String(label)} className="rounded-2xl bg-surface p-3 sm:p-4"><CardIcon className="size-5 text-primary" /><p className="mt-4 text-sm font-bold text-navy">{String(label)}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{String(text)}</p></div> })}</div>
            <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 p-4"><p className="text-xs font-bold uppercase tracking-wide text-primary">{t.business.eyebrow}</p><p className="mt-2 text-sm font-semibold text-navy">{t.business.description}</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
