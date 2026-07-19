'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, Building2, Handshake, ShieldCheck, UsersRound } from 'lucide-react'
import { CATEGORIES } from '@/lib/site'
import { useI18n } from '@/lib/i18n/context'

type Audience = 'platform' | 'users' | 'partners'

const partnerLabels = {
  sr: 'Partneri', hr: 'Partneri', bs: 'Partneri', cnr: 'Partneri', mk: 'Партнери',
  sl: 'Partnerji', sq: 'Partnerë', en: 'Partners', bg: 'Партньори',
} as const

export function PlatformOverview({ audience = 'platform' }: { audience?: Audience }) {
  const { t, locale } = useI18n()
  const partnerLabel = partnerLabels[locale]
  const copy = {
    platform: { title: t.categories.title, description: t.categories.description, primary: '/usluge', action: t.nav.services },
    users: { title: t.nav.forUsers, description: t.categories.description, primary: '/registracija', action: t.cta.getStarted },
    partners: { title: partnerLabel, description: t.trust.label, primary: '/partneri/registracija', action: t.cta.getStarted },
  }[audience]

  const roles = [
    { icon: UsersRound, title: t.nav.forUsers, description: t.categories.description, href: '/za-korisnike' },
    { icon: Building2, title: t.nav.forCompanies, description: t.business.description, href: '/za-kompanije' },
    { icon: Handshake, title: partnerLabel, description: t.trust.label, href: '/partneri' },
  ]

  return (
    <section id="platforma" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <span className="inline-flex rounded-full border border-primary/15 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            balkan.works
          </span>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{copy.description}</p>
          <Link href={copy.primary} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-float transition-transform hover:-translate-y-0.5">
            {copy.action} <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"><BarChart3 className="size-5" /></span>
            <div><p className="font-semibold text-navy">balkan.works</p><p className="text-sm text-muted-foreground">{t.business.dashboard}</p></div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {roles.map((role) => <div key={role.title} className="rounded-2xl border border-border bg-card p-3"><role.icon className="size-5 text-primary" /><p className="mt-4 text-sm font-bold text-navy">{role.title}</p></div>)}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon
          return <Link key={role.title} href={role.href} className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"><Icon className="size-6 text-primary" /><h3 className="mt-6 text-xl font-bold text-navy">{role.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{role.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">{t.cta.learnMore}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link>
        })}
      </div>

      <div className="mt-12 rounded-[1.75rem] border border-border bg-gradient-to-br from-surface to-secondary/50 p-6 sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-primary">{t.nav.services}</p><h3 className="mt-2 text-2xl font-bold text-navy">{t.featured.title}</h3></div><Link href="/usluge" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">{t.cta.showAll}<ArrowRight className="size-4" /></Link></div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.slice(0, 8).map((category) => {
            const item = t.categoryItems[category.key as keyof typeof t.categoryItems]
            const href = category.key === 'poslovi' ? '/poslovi' : `/usluge?tema=${category.key}`
            return <Link key={category.key} href={href} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><category.icon className="size-4" /></span><span className="text-sm font-semibold text-navy">{item.title}</span></Link>
          })}
        </div>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-7"><ShieldCheck className="size-7 text-turquoise" /><h3 className="mt-5 text-xl font-bold text-navy">{t.security.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.security.description}</p></div>
        <div className="rounded-3xl bg-navy p-7 text-white"><Building2 className="size-7 text-cyan-200" /><h3 className="mt-5 text-xl font-bold">{t.business.title}</h3><p className="mt-2 text-sm leading-relaxed text-white/75">{t.business.description}</p><Link href="/za-kompanije" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">{t.business.cta}<ArrowRight className="size-4" /></Link></div>
      </div>
    </section>
  )
}
