import Link from 'next/link'
import { ArrowRight, BadgePercent, CalendarDays, Plus } from 'lucide-react'

const offers = [
  { title: 'Besplatan izlazak na teren', status: 'Aktivna', views: '324 pregleda', until: 'Važi do 30. jula' },
  { title: '20% popusta na hitne intervencije', status: 'Nacrt', views: 'Nije objavljeno', until: 'Spremno za pregled' },
]

export default function BusinessOffersPage() {
  return <div className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold">Ponude</h1><p className="mt-1 text-muted-foreground">Kreiraj akcije koje korisnici vide na balkan.works.</p></div><Link href="/business/settings" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />Nova ponuda</Link></div><div className="grid gap-4">{offers.map((offer) => <article key={offer.title} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><BadgePercent className="size-5" /></div><div><h2 className="font-semibold">{offer.title}</h2><p className="mt-1 text-sm text-muted-foreground">{offer.views}</p></div></div><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">{offer.status}</span></div><div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1"><CalendarDays className="size-4" />{offer.until}</span><Link href="/business/analytics" className="inline-flex items-center gap-1 font-medium text-primary">Rezultati <ArrowRight className="size-4" /></Link></div></article>)}</div></div>
}
