import { ArrowDownLeft, ArrowUpRight, BadgeCheck, CreditCard, ReceiptText, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Novčanik — balkan.works' }

const transactions = [
  { id: 1, type: 'PAYMENT', business: 'Sačuvaj hranu · Pekara Mlin', amount: '200 RSD', date: 'Danas · 09:42', status: 'Potvrda čeka' },
  { id: 2, type: 'CASHBACK', business: 'Balkan povraćaj novca', amount: '20 RSD', date: 'Juče · 17:10', status: 'Evidentirano' },
  { id: 3, type: 'REWARD', business: 'Balkan nagrade', amount: '20 poena', date: '18. jul · 12:28', status: 'Dodeljeno' },
]

export default function WalletPage() {
  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <header>
        <p className="text-xs font-semibold tracking-wide text-primary">BALKAN FINANSIJE</p>
        <h1 className="mt-1 text-3xl font-bold">Novčanik</h1>
        <p className="mt-1 text-muted-foreground">Pregled uplata, povraćaja i pogodnosti.</p>
      </header>

      <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary to-blue-500 p-6 text-primary-foreground shadow-lg shadow-primary/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-primary-foreground/80">Balkan pogodnosti</p>
            <h2 className="mt-2 text-4xl font-bold">240 <span className="text-xl">poena</span></h2>
          </div>
          <CreditCard className="h-8 w-8 opacity-80" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/15 px-3 py-2.5"><p className="text-xs text-white/70">Povraćaj novca</p><p className="mt-1 font-semibold">20 RSD</p></div>
          <div className="rounded-xl bg-white/15 px-3 py-2.5"><p className="text-xs text-white/70">Nivo</p><p className="mt-1 font-semibold">Lokalni heroj</p></div>
        </div>
      </section>

      <section className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
          <div><h2 className="font-semibold">Bezbedna evidencija plaćanja</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">Balkan.works ne čuva broj kartice niti sredstva. Plaćanje se potvrđuje kod licenciranog partnera za plaćanje.</p></div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between"><h2 className="font-semibold">Nedavne aktivnosti</h2><Link href="/app/rewards" className="text-sm font-semibold text-primary">Nagrade i poeni</Link></div>
        {transactions.map((tx) => {
          const positive = tx.type !== 'PAYMENT'
          return <article key={tx.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className={`rounded-xl p-2.5 ${positive ? 'bg-emerald-500/15 text-emerald-600' : 'bg-primary/10 text-primary'}`}>{positive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</span>
              <div className="min-w-0"><p className="truncate text-sm font-semibold">{tx.business}</p><p className="mt-0.5 text-xs text-muted-foreground">{tx.date} · {tx.status}</p></div>
            </div>
            <p className={`shrink-0 text-sm font-bold ${positive ? 'text-emerald-600' : ''}`}>{positive ? '+' : '−'}{tx.amount}</p>
          </article>
        })}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3"><BadgeCheck className="h-5 w-5 text-primary" /><div><h2 className="font-semibold">Plaćanja uskoro</h2><p className="mt-0.5 text-sm text-muted-foreground">Odaberite uslugu ili paket sačuvane hrane, pa platite preko bezbednog partnera.</p></div></div>
        <Link href="/app/bookings" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-primary py-2.5 text-sm font-semibold text-primary"><ReceiptText className="h-4 w-4" /> Pogledaj rezervacije</Link>
      </section>
    </div>
  )
}
