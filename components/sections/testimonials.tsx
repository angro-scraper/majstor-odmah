import { Star } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const TESTIMONIALS = [
  {
    quote:
      'Za pola sata sam našla vodoinstalatera i zakazala termin. Sve iz jedne aplikacije — nestvarno praktično.',
    name: 'Jelena Marković',
    role: 'Korisnica, Beograd',
  },
  {
    quote:
      'Kao frilenser dobijam nove klijente svake nedelje. Naplata preko novčanika je brza i sigurna.',
    name: 'Anteo Kovačević',
    role: 'Grafički dizajner, Zagreb',
  },
  {
    quote:
      'Vodimo mali restoran i dostava preko balkan.works nam je udvostručila porudžbine.',
    name: 'Emir Hadžić',
    role: 'Vlasnik restorana, Sarajevo',
  },
  {
    quote:
      'AI pomoćnik mi je našao let i hotel jeftinije nego bilo gde. Preporuka za sva putovanja.',
    name: 'Ana Novak',
    role: 'Korisnica, Ljubljana',
  },
  {
    quote:
      'Kontrolna tabla za kompanije je pregledna i štedi mi sate posla svakog dana.',
    name: 'Nikola Popovski',
    role: 'Menadžer, Skoplje',
  },
  {
    quote:
      'Konačno jedna aplikacija za sve — od plaćanja računa do zakazivanja lekara.',
    name: 'Lorena Gjoka',
    role: 'Korisnica, Tirana',
  },
]

export function Testimonials() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SectionHeading
          eyebrow="Iskustva korisnika"
          title="Vole nas širom regiona"
          description="Hiljade korisnika, frilensera i kompanija svakodnevno koristi balkan.works."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current text-amber-400" />
                ))}
              </div>
              <blockquote className="text-[15px] leading-relaxed text-navy">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                <span className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-navy">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
