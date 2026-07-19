'use client'

import Link from 'next/link'
import { ArrowRight, Building2, Handshake, ShieldCheck } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function DownloadCta() {
  const { t } = useI18n()

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
              {t.business.title}
            </h2>
            <p className="max-w-md text-pretty text-lg leading-relaxed text-primary-foreground/90">
              {t.business.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/registracija"
                className="inline-flex items-center gap-2 rounded-2xl bg-card px-5 py-3 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
              >
                {t.cta.getStarted} <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/partneri/registracija"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-white/10"
              >
                {t.business.cta}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              [Building2, t.business.features[0].title],
              [Handshake, t.business.features[1].title],
              [ShieldCheck, t.business.features[2].title],
            ].map(([Icon, label]) => {
              const CardIcon = Icon as typeof Building2
              return (
                <div key={String(label)} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <CardIcon className="size-5 text-cyan-200" />
                  <p className="mt-3 text-sm font-semibold text-primary-foreground">{String(label)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
