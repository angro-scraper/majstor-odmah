'use client'

import { ChevronLeft, Filter, Search, X } from 'lucide-react'
import Link from 'next/link'
import { use, useMemo, useState } from 'react'
import { BusinessCard } from '@/components/app/business-card'

const CATEGORY_LABELS: Record<string, string> = {
  'home-services': 'Usluge za dom', food: 'Hrana', auto: 'Auto', health: 'Zdravlje', 'real-estate': 'Nekretnine', sports: 'Sport', beauty: 'Lepota', education: 'Edukacija', travel: 'Putovanja', pet: 'Kućni ljubimci', events: 'Događaji',
}

const CATEGORY_RESULTS = [
  { id: 1, name: 'Elite Electricians', rating: 4.9, reviews: 234, distance: '0.5 km', category: 'Električar', verified: true, responseTime: '< 1 sat' },
  { id: 2, name: 'Quick Plumbing Co', rating: 4.8, reviews: 189, distance: '1.2 km', category: 'Vodoinstalater', verified: true, responseTime: '< 2 sata' },
  { id: 3, name: 'Pro Painting Services', rating: 4.7, reviews: 156, distance: '2.1 km', category: 'Majstori za dom', verified: false, responseTime: 'Danas' },
  { id: 4, name: 'Pekara Jutro', rating: 4.8, reviews: 98, distance: '0.6 km', category: 'Pekara', verified: true, responseTime: 'Otvoreno sada' },
]

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [showFilters, setShowFilters] = useState(false)
  const [query, setQuery] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const { slug } = use(params)
  const category = CATEGORY_LABELS[slug] ?? slug.replaceAll('-', ' ')
  const visibleBusinesses = useMemo(() => CATEGORY_RESULTS.filter((business) => {
    const matchesQuery = `${business.name} ${business.category}`.toLowerCase().includes(query.toLowerCase().trim())
    const matchesVerified = !verifiedOnly || business.verified
    const matchesNearby = !nearbyOnly || Number.parseFloat(business.distance) <= 1.5
    return matchesQuery && matchesVerified && matchesNearby
  }), [nearbyOnly, query, verifiedOnly])

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background px-4 py-4">
        <Link href="/app" className="p-2 hover:bg-secondary rounded-lg transition" aria-label="Nazad na početnu"><ChevronLeft className="w-6 h-6" /></Link>
        <h1 className="ml-2 flex-1 text-lg font-bold capitalize">{category}</h1>
        <button type="button" onClick={() => setShowFilters((current) => !current)} className={`p-2 rounded-lg transition ${showFilters ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`} aria-expanded={showFilters} aria-label="Prikaži filtere"><Filter className="w-6 h-6" /></button>
      </div>

      <div className="border-b border-border px-4 py-4"><div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pretraži u ovoj kategoriji…" className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary" />{query ? <button type="button" onClick={() => setQuery('')} className="absolute right-2 top-2 p-1 text-muted-foreground" aria-label="Obriši pretragu"><X className="size-4" /></button> : null}</div></div></div>

      {showFilters ? <div className="space-y-3 border-b border-border bg-secondary/50 px-4 py-4"><p className="text-sm font-semibold">Filteri</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setNearbyOnly((current) => !current)} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${nearbyOnly ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'}`}>Do 1.5 km</button><button type="button" onClick={() => setVerifiedOnly((current) => !current)} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${verifiedOnly ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'}`}>Verifikovano</button></div></div> : null}

      <div className="px-4 py-4"><p className="text-sm text-muted-foreground">{visibleBusinesses.length} rezultata</p></div>
      <div className="space-y-3 px-4">{visibleBusinesses.length ? visibleBusinesses.map((business) => <BusinessCard key={business.id} business={business} />) : <div className="rounded-2xl border border-border bg-card p-6 text-center"><p className="font-semibold text-navy">Nema rezultata za ovaj izbor</p><button type="button" onClick={() => { setQuery(''); setNearbyOnly(false); setVerifiedOnly(false) }} className="mt-3 text-sm font-medium text-primary">Obriši filtere</button></div>}</div>
    </div>
  )
}
