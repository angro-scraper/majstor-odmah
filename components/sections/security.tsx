import { ShieldCheck, BadgeCheck, Lock, Star, Headphones } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const ITEMS = [
  { icon: ShieldCheck, title: 'Bezbedna plaćanja', desc: 'Sve transakcije su šifrovane i zaštićene najvišim standardima.' },
  { icon: BadgeCheck, title: 'Provereni pružaoci', desc: 'Verifikujemo identitet i dokumente svakog pružaoca usluge.' },
  { icon: Lock, title: 'Zaštita privatnosti', desc: 'Vaši podaci su sigurni i nikada se ne dele bez vašeg pristanka.' },
  { icon: Star, title: 'Ocene i recenzije', desc: 'Realne ocene korisnika pomažu vam da izaberete najbolje.' },
  { icon: Headphones, title: 'Podrška 24/7', desc: 'Naš tim je uvek dostupan da vam pomogne, gde god da ste.' },
]

export function Security() {
  return (
    <section id="bezbednost" className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Bezbednost i poverenje"
          title="Sigurno i brzo, u svakom trenutku"
          description="Gradimo platformu kojoj možete verovati — sa najvišim standardima bezbednosti za vaše podatke i novac."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft ${
                i === 0 ? 'lg:col-span-1' : ''
              }`}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                <item.icon className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-navy">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
          <div className="flex flex-col justify-center gap-2 rounded-2xl border border-primary/20 bg-primary p-6 text-primary-foreground shadow-float">
            <p className="font-display text-3xl font-bold">99.9%</p>
            <p className="text-sm opacity-90">dostupnost platforme i podrške svakog dana u godini.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
