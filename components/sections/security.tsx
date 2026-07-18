'use client'

import { ShieldCheck, BadgeCheck, Lock, Star, Headphones } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { useI18n } from '@/lib/i18n/context'

const ICONS = [ShieldCheck, BadgeCheck, Lock, Star, Headphones]

export function Security() {
  const { t } = useI18n()

  return (
    <section id="bezbednost" className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHeading
          eyebrow={t.security.eyebrow}
          title={t.security.title}
          description={t.security.description}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.security.items.map((item, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-navy">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            )
          })}
          <div className="flex flex-col justify-center gap-2 rounded-3xl border border-primary/20 bg-primary p-7 text-primary-foreground shadow-float">
            <p className="font-display text-3xl font-bold">{t.security.uptimeValue}</p>
            <p className="text-sm opacity-90">{t.security.uptimeLabel}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
