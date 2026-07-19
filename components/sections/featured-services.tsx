'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Wrench,
  UtensilsCrossed,
  Plane,
  Wallet,
  HeartPulse,
  Star,
  MapPin,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'

type Item = { title: string; meta: string; extra: string; badge?: string }

const MODULES: {
  id: string
  catKey: string
  icon: typeof Briefcase
  href: string
  items: Item[]
}[] = [
  {
    id: 'poslovi',
    catKey: 'poslovi',
    icon: Briefcase,
    href: '/poslovi',
    items: [
      { title: 'Front-end Developer', meta: 'Remote · Puno radno vreme', extra: '2.000 – 3.000 €', badge: 'Novo' },
      { title: 'Marketing Specijalista', meta: 'Beograd · Hibridno', extra: '1.200 – 1.800 €' },
      { title: 'Vozač B kategorije', meta: 'Zagreb · Puno radno vreme', extra: '900 – 1.100 €' },
    ],
  },
  {
    id: 'usluge',
    catKey: 'majstori',
    icon: Wrench,
    href: '/app/category/home-services',
    items: [
      { title: 'Marko — Električar', meta: 'Novi Sad · Dostupan danas', extra: 'od 1.500 RSD', badge: 'Top' },
      { title: 'Ivan — Vodoinstalater', meta: 'Beograd · Za 2 sata', extra: 'od 2.000 RSD' },
      { title: 'Ana — Moler', meta: 'Niš · Sutra ujutru', extra: 'od 1.200 RSD' },
    ],
  },
  {
    id: 'dostava',
    catKey: 'dostava',
    icon: UtensilsCrossed,
    href: '/app/category/food',
    items: [
      { title: 'Burger House', meta: '30–40 min · Besplatna dostava', extra: '4.8', badge: 'Popust' },
      { title: 'Pizza Bar', meta: '25–35 min · Besplatna dostava', extra: '4.7' },
      { title: 'Sushi Point', meta: '35–45 min · 199 RSD', extra: '4.9' },
    ],
  },
  {
    id: 'putovanja',
    catKey: 'putovanja',
    icon: Plane,
    href: '/app/category/travel',
    items: [
      { title: 'Beograd → Istanbul', meta: 'Air Serbia · 20. jun', extra: 'od 128 €', badge: 'Akcija' },
      { title: 'Zagreb → Beč', meta: 'Croatia Airlines · 24. jun', extra: 'od 96 €' },
      { title: 'Podgorica → Rim', meta: 'ITA Airways · 28. jun', extra: 'od 142 €' },
    ],
  },
  {
    id: 'novcanik',
    catKey: 'finansije',
    icon: Wallet,
    href: '/app/wallet',
    items: [
      { title: 'Plaćanje računa', meta: 'Struja, voda, telefon', extra: 'Bez naknade', badge: 'Novo' },
      { title: 'Transfer novca', meta: 'Trenutno u celom regionu', extra: '0 €' },
      { title: 'Virtuelna kartica', meta: 'Za online kupovinu', extra: 'Besplatno' },
    ],
  },
  {
    id: 'zdravlje',
    catKey: 'zdravlje',
    icon: HeartPulse,
    href: '/app/category/health',
    items: [
      { title: 'Dr Marko Jovanović', meta: 'Kardiolog · Klinika Beograd', extra: '22. maj 10:30', badge: 'Slobodno' },
      { title: 'Dr Ana Perić', meta: 'Dermatolog · Novi Sad', extra: '23. maj 12:00' },
      { title: 'Dr Ivan Kovač', meta: 'Stomatolog · Zagreb', extra: '24. maj 09:15' },
    ],
  },
]

export function FeaturedServices() {
  const { t } = useI18n()
  const [active, setActive] = useState(MODULES[0].id)
  const current = MODULES.find((m) => m.id === active) ?? MODULES[0]
  const currentLabel = t.categoryItems[current.catKey as keyof typeof t.categoryItems].title

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <SectionHeading
        eyebrow={t.featured.eyebrow}
        title={t.featured.title}
        description={t.featured.description}
      />

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {MODULES.map((m) => {
          const isActive = m.id === active
          const label = t.categoryItems[m.catKey as keyof typeof t.categoryItems].title
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActive(m.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-navy',
              )}
            >
              <m.icon className="size-4" />
              {label}
            </button>
          )
        })}
      </div>

      <div className="mt-10 rounded-[1.75rem] border border-border bg-gradient-to-br from-surface to-secondary/40 p-5 sm:p-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-navy">{currentLabel}</h3>
          <Link href={current.href} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-navy">
            {t.cta.showAll} <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {current.items.map((item) => (
            <Link
              key={item.title}
              href={current.href}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                  <current.icon className="size-5" />
                </span>
                {item.badge && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-turquoise">
                    {item.badge}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">{item.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" />
                  {item.meta}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-bold text-primary">{item.extra}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {current.id === 'dostava' || current.id === 'usluge' ? (
                    <Star className="size-3.5 fill-current text-amber-400" />
                  ) : (
                    <Clock className="size-3.5" />
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
