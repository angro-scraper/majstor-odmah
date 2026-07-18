import type { Metadata } from 'next'
import { Target, Users, Globe2, Rocket } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { Coverage } from '@/components/sections/coverage'

export const metadata: Metadata = {
  title: 'O nama — balkan.works',
  description:
    'balkan.works je super aplikacija koja povezuje ljude i kompanije širom Balkana kroz jedinstvenu platformu.',
}

const STATS = [
  { value: '2023', label: 'Godina osnivanja' },
  { value: '1.2M+', label: 'Korisnika' },
  { value: '45.000+', label: 'Pružalaca usluga' },
  { value: '8', label: 'Zemalja regiona' },
]

const VALUES = [
  { icon: Target, title: 'Fokus na korisnika', desc: 'Svaku odluku donosimo misleći na iskustvo naših korisnika.' },
  { icon: Globe2, title: 'Regionalna povezanost', desc: 'Rušimo granice i povezujemo ceo Balkan na jednom mestu.' },
  { icon: Users, title: 'Poverenje i sigurnost', desc: 'Gradimo platformu kojoj ljudi i kompanije mogu verovati.' },
  { icon: Rocket, title: 'Stalne inovacije', desc: 'Neprestano unapređujemo tehnologiju i uvodimo nove usluge.' },
]

export default function ONamaPage() {
  return (
    <PageShell pageKey="about">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
              <p className="font-display text-3xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-navy">Naša priča</h2>
            <p className="leading-relaxed text-muted-foreground">
              balkan.works je nastao iz jednostavne ideje — zašto koristiti
              desetine aplikacija kada sve može da stane u jednu? Krenuli smo od
              povezivanja korisnika sa lokalnim majstorima, a danas nudimo
              poslove, dostavu, putovanja, zdravlje, plaćanja i AI pomoćnika.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Verujemo u snagu regiona i u to da tehnologija treba da bude
              dostupna svima. Zato gradimo platformu koja govori jezikom Balkana
              i razume potrebe ljudi koji ovde žive i posluju.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
                  <v.icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold text-navy">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Coverage />
    </PageShell>
  )
}
