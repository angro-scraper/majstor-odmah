'use client'

import { UserPlus, ListChecks, CalendarCheck, ShieldCheck } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { useI18n } from '@/lib/i18n/context'

const ICONS = [UserPlus, ListChecks, CalendarCheck, ShieldCheck]

export function HowItWorks() {
  const { t } = useI18n()

  return (
    <section id="kako-funkcionise" className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHeading
          eyebrow={t.how.eyebrow}
          title={t.how.title}
          description={t.how.description}
        />

        <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />
          {t.how.steps.map((step, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={step.title}
                className="relative flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-float">
                    <Icon className="size-6" />
                  </span>
                  <span className="font-display text-4xl font-bold text-secondary">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-navy">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
