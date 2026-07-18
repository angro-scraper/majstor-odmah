import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { ForBusiness } from '@/components/sections/for-business'

export const metadata: Metadata = {
  title: 'Za kompanije — balkan.works',
  description:
    'Objavljujte usluge i poslove, primajte rezervacije i naplaćujte bezbedno. Vodite ceo biznis iz jedne aplikacije.',
}

const PLANS = [
  {
    name: 'Start',
    price: '0 €',
    note: 'mesečno',
    features: ['Do 10 aktivnih oglasa', 'Osnovna kontrolna tabla', 'Poruke sa klijentima', 'Ocene i recenzije'],
    cta: 'Počni besplatno',
    highlight: false,
  },
  {
    name: 'Biznis',
    price: '29 €',
    note: 'mesečno',
    features: ['Neograničeni oglasi', 'Napredna analitika', 'Naplata i fakturisanje', 'Prioritetna podrška', 'Promocija ponuda'],
    cta: 'Izaberi Biznis',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Po dogovoru',
    note: '',
    features: ['Više lokacija i timova', 'Namenski menadžer', 'API integracije', 'Prilagođeni ugovori'],
    cta: 'Kontaktiraj prodaju',
    highlight: false,
  },
]

export default function ZaKompanijePage() {
  return (
    <PageShell
      eyebrow="Za kompanije"
      title="Rastite svoj biznis na Balkanu"
      description="Alati za oglašavanje, rezervacije, naplatu i komunikaciju — sve na jednoj platformi za profesionalce i kompanije."
    >
      <ForBusiness />

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Planovi za svaku fazu rasta
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Počnite besplatno i nadogradite kada vam zatreba više.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col gap-6 rounded-3xl border p-8 ${
                  plan.highlight
                    ? 'border-primary bg-card shadow-float'
                    : 'border-border bg-card shadow-soft'
                }`}
              >
                <div>
                  {plan.highlight && (
                    <span className="mb-3 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Najpopularniji
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-navy">{plan.name}</h3>
                  <p className="mt-2 flex items-end gap-1">
                    <span className="font-display text-4xl font-bold text-navy">{plan.price}</span>
                    {plan.note && <span className="pb-1 text-sm text-muted-foreground">{plan.note}</span>}
                  </p>
                </div>
                <ul className="flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-navy">
                      <Check className="size-4 shrink-0 text-turquoise" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/kontakt"
                  className={`mt-auto inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                    plan.highlight
                      ? 'bg-primary text-primary-foreground shadow-float'
                      : 'border border-border bg-card text-navy'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
