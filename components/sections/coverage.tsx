import { MapPin } from 'lucide-react'
import { COUNTRIES } from '@/lib/site'
import { SectionHeading } from '@/components/section-heading'

export function Coverage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <SectionHeading
        eyebrow="Regionalna pokrivenost"
        title="Ceo Balkan na jednom mestu"
        description="Povezujemo ljude i kompanije širom regiona — lokalno, regionalno i vaše."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {COUNTRIES.map((c) => (
          <div
            key={c.name}
            className="group flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-sm font-bold text-primary">
                {c.code}
              </span>
              <MapPin className="size-4 text-cyan-accent" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-navy">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.cities}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-surface px-6 py-6 text-center text-sm text-muted-foreground">
        Aktivni smo u <span className="font-semibold text-navy">8 zemalja</span> i
        preko <span className="font-semibold text-navy">40 gradova</span> — i
        nastavljamo da rastemo.
      </div>
    </section>
  )
}
