'use client'

import Link from 'next/link'
import { ArrowRight, Building2, Check, Handshake, UsersRound } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function PlatformAccess() {
  const { t, locale } = useI18n()
  const partnerLabel = {
    sr: 'Partneri', hr: 'Partneri', bs: 'Partneri', cnr: 'Partneri', mk: 'Партнери',
    sl: 'Partnerji', sq: 'Partnerë', en: 'Partners', bg: 'Партньори',
  }[locale]
  const options = [
    { icon: UsersRound, title: t.nav.forUsers, href: '/registracija', action: t.cta.getStarted },
    { icon: Building2, title: t.nav.forCompanies, href: '/za-kompanije', action: t.business.cta },
    { icon: Handshake, title: partnerLabel, href: '/partneri/registracija', action: t.cta.getStarted },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-[2rem] border border-border bg-gradient-to-br from-secondary to-card p-7 shadow-card sm:p-12">
        <p className="text-sm font-semibold text-primary">balkan.works</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
          {t.business.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t.business.description}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {options.map((option) => {
            const Icon = option.icon
            return (
              <Link key={option.href} href={option.href} className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card">
                <Icon className="size-6 text-primary" />
                <h2 className="mt-5 text-lg font-bold text-navy">{option.title}</h2>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">{option.action}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            )
          })}
        </div>
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"><Check className="size-4 text-turquoise" /> {t.cta.getStarted}</p>
      </div>
    </div>
  )
}
