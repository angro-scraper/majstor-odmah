import Link from 'next/link'
import { ArrowRight, Compass, MapPin, Sparkles } from 'lucide-react'
import { BusinessCard } from '@/components/app/business-card'

const localBusinesses = [
  { id: 2, name: 'Quick Plumbing Co', rating: 4.8, reviews: 189, distance: '1.2 km', category: 'Vodoinstalater', verified: true, responseTime: '< 2 sata' },
  { id: 3, name: 'Pro Painting Services', rating: 4.7, reviews: 156, distance: '2.1 km', category: 'Majstori za dom', verified: false, responseTime: 'Danas' },
]

export const metadata = { title: 'Otkrij — balkan.works' }

export default function DiscoverPage() {
  return (
    <div className="space-y-6 px-4 py-6 pb-24">
      <header><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary"><MapPin className="size-4" /> BEOGRAD, SRBIJA</div><h1 className="flex items-center gap-2 text-3xl font-bold text-navy"><Compass className="size-7 text-primary" />Otkrij lokalno</h1><p className="mt-1 text-muted-foreground">Aktuelne ponude, nove firme i prilike iz tvog grada.</p></header>
      <div className="grid gap-3 sm:grid-cols-2"><Link href="/app/deals" className="rounded-2xl border border-border bg-secondary/60 p-4 transition hover:border-primary/40"><Sparkles className="size-5 text-primary" /><h2 className="mt-3 font-semibold text-navy">Akcije ove nedelje</h2><p className="mt-1 text-sm text-muted-foreground">Digitalni flajeri i ponude u blizini.</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">Istraži <ArrowRight className="size-4" /></span></Link><Link href="/app/save-food" className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"><span className="grid size-5 place-items-center rounded-full bg-turquoise/15 text-xs text-turquoise">✓</span><h2 className="mt-3 font-semibold text-navy">Sačuvaj hranu</h2><p className="mt-1 text-sm text-muted-foreground">Paketi lokalnih partnera spremni za preuzimanje.</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">Pogledaj pakete <ArrowRight className="size-4" /></span></Link></div>
      <section className="space-y-3"><div className="flex items-center justify-between"><h2 className="font-semibold text-navy">Popularno u tvojoj blizini</h2><Link href="/app/category/home-services" className="text-sm font-medium text-primary">Sve usluge</Link></div>{localBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)}</section>
      <Link href="/app/rewards" className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"><div><p className="font-semibold text-navy">Lokalne nagrade</p><p className="mt-1 text-sm text-muted-foreground">Saznaj kako da sakupiš poene dok otkrivaš grad.</p></div><ArrowRight className="size-5 text-primary" /></Link>
    </div>
  )
}
