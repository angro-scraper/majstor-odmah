'use client'

import { MapPin } from 'lucide-react'
import { COUNTRIES } from '@/lib/site'
import { SectionHeading } from '@/components/section-heading'
import { useI18n } from '@/lib/i18n/context'

export function Coverage() {
  const { t } = useI18n()

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <SectionHeading
        eyebrow={t.coverage.eyebrow}
        title={t.coverage.title}
        description={t.coverage.description}
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {COUNTRIES.map((c) => (
          <div
            key={c.code}
            className="group flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-sm font-bold text-primary">
                {c.code}
              </span>
              <MapPin className="size-4 text-cyan-accent" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-navy">
                {t.countries[c.code as keyof typeof t.countries]}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.cities}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-surface px-6 py-6 text-center text-sm text-muted-foreground">
        {t.coverage.note}
      </div>
    </section>
  )
}
