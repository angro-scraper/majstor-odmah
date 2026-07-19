import Link from 'next/link'
import { ArrowRight, Gift, Medal, Sparkles, Ticket } from 'lucide-react'

const history = [
  { label: 'Rezervisao/la si paket sačuvane hrane', points: '+10', time: 'Danas' },
  { label: 'Sačuvao/la si lokalnu ponudu', points: '+2', time: 'Juče' },
  { label: 'Ostavio/la si recenziju', points: '+5', time: 'Pre 2 dana' },
]

export const metadata = { title: 'Nagrade — balkan.works' }

export default function RewardsPage() {
  return (
    <div className="space-y-6 px-4 py-6 pb-24">
      <header><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary"><Sparkles className="size-4" /> BALKAN NAGRADE</div><h1 className="text-3xl font-bold text-navy">Tvoje lokalne nagrade</h1><p className="mt-1 text-muted-foreground">Skupljaj poene kada otkrivaš, čuvaš i koristiš lokalne prilike.</p></header>
      <section className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-float"><div className="flex items-start justify-between"><div><p className="text-sm text-primary-foreground/75">Tvoj saldo</p><p className="mt-1 text-4xl font-bold">280 <span className="text-base font-semibold">poena</span></p></div><div className="grid size-11 place-items-center rounded-2xl bg-primary-foreground/15"><Medal className="size-6" /></div></div><div className="mt-5 flex items-center justify-between rounded-2xl bg-primary-foreground/10 px-4 py-3"><div><p className="text-xs text-primary-foreground/75">Sledeći nivo</p><p className="text-sm font-semibold">Lokalni heroj · još 220 poena</p></div><div className="h-2 w-24 overflow-hidden rounded-full bg-primary-foreground/20"><div className="h-full w-1/2 rounded-full bg-primary-foreground" /></div></div></section>
      <section><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-navy">Iskoristi poene</h2><Link href="/app/deals" className="text-sm font-medium text-primary">Sve pogodnosti</Link></div><div className="grid grid-cols-2 gap-3"><Link href="/app/deals" className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"><Ticket className="size-5 text-primary" /><p className="mt-3 text-sm font-semibold text-navy">Popust 10%</p><p className="mt-1 text-xs text-muted-foreground">100 poena</p></Link><Link href="/app/save-food" className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"><Gift className="size-5 text-primary" /><p className="mt-3 text-sm font-semibold text-navy">Bonus za sačuvanu hranu</p><p className="mt-1 text-xs text-muted-foreground">150 poena</p></Link></div></section>
      <section><h2 className="mb-3 font-semibold text-navy">Istorija poena</h2><div className="space-y-2">{history.map((entry) => <div key={entry.label} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"><div><p className="text-sm font-medium text-navy">{entry.label}</p><p className="mt-1 text-xs text-muted-foreground">{entry.time}</p></div><span className="text-sm font-bold text-primary">{entry.points}</span></div>)}</div></section>
      <Link href="/app/discover" className="flex items-center justify-between rounded-2xl border border-border bg-secondary/60 p-4"><div><p className="font-semibold text-navy">Pozovi prijatelja</p><p className="mt-1 text-sm text-muted-foreground">Oboje dobijate poene kada se pridruži.</p></div><ArrowRight className="size-5 text-primary" /></Link>
    </div>
  )
}
