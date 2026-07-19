'use client'

import Link from 'next/link'
import { ArrowRight, BadgePercent, Bookmark, Clock3, MapPin, Sparkles } from 'lucide-react'
import { useState } from 'react'

const deals = [
  { id: '1', business: 'Market Komšija', title: 'Vikend korpa sa 30% popusta', category: 'Hrana', distance: '0.8 km', expires: 'Važi do nedelje', discount: '-30%' },
  { id: '2', business: 'Dom i stil', title: 'Popust na kućne popravke', category: 'Dom', distance: '1.4 km', expires: 'Još 3 dana', discount: '-20%' },
  { id: '3', business: 'Auto Centar', title: 'Letnja provera vozila', category: 'Auto', distance: '2.1 km', expires: 'Do kraja meseca', discount: '-15%' },
]

export default function DealsPage() {
  const [selectedFilter, setSelectedFilter] = useState('Sve')
  const [savedDeals, setSavedDeals] = useState<string[]>([])
  const visibleDeals = selectedFilter === 'Sve' ? deals : deals.filter((deal) => deal.category === selectedFilter)

  return (
    <div className="space-y-6 px-4 py-6 pb-24">
      <header>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary"><Sparkles className="size-4" /> LOKALNO I AKTUELNO</div>
        <h1 className="text-3xl font-bold text-navy">Ponude u tvojoj blizini</h1>
        <p className="mt-1 text-muted-foreground">Digitalni flajeri i akcije firmi koje su ti najbliže.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Kategorije ponuda">
        {['Sve', 'Hrana', 'Dom', 'Auto', 'Lepota'].map((filter) => (
          <button key={filter} type="button" onClick={() => setSelectedFilter(filter)} aria-pressed={selectedFilter === filter} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${selectedFilter === filter ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'}`}>{filter}</button>
        ))}
      </div>

      <section className="space-y-3" aria-label="Aktivne ponude">
        {visibleDeals.length ? visibleDeals.map((deal) => (
          <article key={deal.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><BadgePercent className="size-5" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">{deal.business} · {deal.category}</p>
                <h2 className="mt-1 text-base font-semibold text-navy">{deal.title}</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{deal.discount}</span>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{deal.distance}</span><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />{deal.expires}</span></div>
            <div className="mt-4 flex gap-2 border-t border-border pt-3">
              <Link href={`/app/business/${deal.id}`} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground">Otvori ponudu <ArrowRight className="size-4" /></Link>
              <button type="button" onClick={() => setSavedDeals((current) => current.includes(deal.id) ? current.filter((id) => id !== deal.id) : [...current, deal.id])} aria-label={`Sačuvaj ponudu ${deal.title}`} aria-pressed={savedDeals.includes(deal.id)} className={`grid size-10 place-items-center rounded-xl border transition hover:border-primary hover:text-primary ${savedDeals.includes(deal.id) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}><Bookmark className={`size-4 ${savedDeals.includes(deal.id) ? 'fill-primary' : ''}`} /></button>
            </div>
          </article>
        )) : <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">Nema ponuda u ovoj kategoriji. Izaberi drugu kategoriju.</div>}
      </section>

      <Link href="/app/saved" className="block rounded-2xl border border-border bg-secondary/60 p-4 transition hover:border-primary/40"><p className="font-semibold text-navy">Sačuvane ponude</p><p className="mt-1 text-sm text-muted-foreground">Vrati se na akcije koje želiš da iskoristiš.</p></Link>
    </div>
  )
}
