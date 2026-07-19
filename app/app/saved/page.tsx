import Link from 'next/link'
import { ArrowRight, Bookmark, FolderHeart } from 'lucide-react'
import { BusinessCard } from '@/components/app/business-card'

const savedBusinesses = [
  { id: 1, name: 'Elite Električari', rating: 4.9, reviews: 234, distance: '0.5 km', category: 'Električar', verified: true, responseTime: '< 1 sat' },
  { id: 4, name: 'Pekara Jutro', rating: 4.8, reviews: 98, distance: '0.6 km', category: 'Pekara', verified: true, responseTime: 'Otvoreno sada' },
]

export const metadata = { title: 'Sačuvano — balkan.works' }

export default function SavedPage() {
  return (
    <div className="space-y-6 px-4 py-6 pb-24"><header><h1 className="flex items-center gap-2 text-3xl font-bold text-navy"><Bookmark className="size-7 text-primary" />Sačuvano</h1><p className="mt-1 text-muted-foreground">Tvoje firme, ponude i mesta kojima želiš da se vratiš.</p></header><section className="space-y-3"><div className="flex items-center justify-between"><h2 className="font-semibold text-navy">Omiljene firme</h2><span className="text-xs text-muted-foreground">{savedBusinesses.length} sačuvano</span></div>{savedBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)}</section><section className="rounded-2xl border border-border bg-secondary/60 p-4"><div className="flex items-start gap-3"><div className="grid size-10 place-items-center rounded-xl bg-card text-primary"><FolderHeart className="size-5" /></div><div className="flex-1"><h2 className="font-semibold text-navy">Sačuvane ponude</h2><p className="mt-1 text-sm text-muted-foreground">Ponude koje sačuvaš biće ovde dok su aktivne.</p><Link href="/app/deals" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">Istraži aktuelne ponude <ArrowRight className="size-4" /></Link></div></div></section></div>
  )
}
