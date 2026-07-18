import {
  Plus,
  Send,
  Eye,
  Briefcase,
  Wrench,
  UtensilsCrossed,
  Plane,
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Bell,
} from 'lucide-react'
import { LogoMark } from '@/components/logo'

/* Novčanik / Wallet */
export function WalletScreen() {
  const tx = [
    { name: 'Wolt', note: 'Dostava hrane', amount: '-1.250,00', up: false },
    { name: 'Maxi', note: 'Kupovina', amount: '-2.435,50', up: false },
    { name: 'Isplata', note: 'Primljeno', amount: '+15.000,00', up: true },
  ]
  return (
    <div className="px-4 pb-5 pt-3">
      <p className="text-sm font-semibold text-navy">Novčanik</p>
      <div className="mt-3 rounded-2xl bg-gradient-to-br from-primary to-[#1e40af] p-4 text-primary-foreground">
        <div className="flex items-center justify-between text-[11px] opacity-80">
          <span>Dostupna sredstva</span>
          <Eye className="size-3.5" />
        </div>
        <p className="mt-1 text-2xl font-bold">12.450,00 RSD</p>
        <p className="mt-1 text-[10px] opacity-80">RS35 2650 0000 1234 5678 90</p>
        <div className="mt-3 flex gap-2">
          <span className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-white/20 py-2 text-[11px] font-semibold">
            <Plus className="size-3.5" /> Dodaj
          </span>
          <span className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-white/20 py-2 text-[11px] font-semibold">
            <Send className="size-3.5" /> Pošalji
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold text-navy">Nedavne transakcije</p>
      <div className="mt-2 space-y-2">
        {tx.map((t) => (
          <div key={t.name} className="flex items-center gap-3">
            <span
              className={`grid size-8 place-items-center rounded-xl ${t.up ? 'bg-accent text-turquoise' : 'bg-secondary text-primary'}`}
            >
              {t.up ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
            </span>
            <span className="flex-1">
              <span className="block text-xs font-semibold text-navy">{t.name}</span>
              <span className="block text-[10px] text-muted-foreground">{t.note}</span>
            </span>
            <span
              className={`text-xs font-semibold ${t.up ? 'text-turquoise' : 'text-navy'}`}
            >
              {t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Poslovi / Jobs */
export function JobsScreen() {
  const jobs = [
    { title: 'Front-end Developer', loc: 'Remote · Puno radno vreme', pay: '2.000 – 3.000 €' },
    { title: 'Marketing Specijalista', loc: 'Beograd · Puno radno vreme', pay: '1.200 – 1.800 €' },
    { title: 'Grafički dizajner', loc: 'Novi Sad · Honorarno', pay: '1.000 – 1.500 €' },
  ]
  return (
    <div className="px-4 pb-5 pt-3">
      <p className="text-sm font-semibold text-navy">Poslovi</p>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[11px] text-muted-foreground">
        <Search className="size-3.5" /> Pretražite poslove...
      </div>
      <div className="mt-3 space-y-2">
        {jobs.map((j) => (
          <div key={j.title} className="rounded-2xl border border-border p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-secondary text-primary">
                <Briefcase className="size-4" />
              </span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold text-turquoise">
                Novo
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold text-navy">{j.title}</p>
            <p className="text-[10px] text-muted-foreground">{j.loc}</p>
            <p className="mt-1 text-[11px] font-semibold text-primary">{j.pay}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Usluge / Services */
export function ServicesScreen() {
  const items = [
    { icon: Wrench, label: 'Majstor za sve' },
    { icon: UtensilsCrossed, label: 'Dostava hrane' },
    { icon: Plane, label: 'Putovanja' },
    { icon: Star, label: 'Lepota i nega' },
  ]
  return (
    <div className="px-4 pb-5 pt-3">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[11px] text-muted-foreground">
        <Search className="size-3.5" /> Pretražite usluge...
      </div>
      <p className="mt-3 text-xs font-semibold text-navy">Popularno</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {items.map((it) => (
          <div key={it.label} className="rounded-2xl border border-border p-3">
            <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
              <it.icon className="size-4" />
            </span>
            <p className="mt-2 text-[11px] font-semibold text-navy">{it.label}</p>
            <p className="text-[9px] text-muted-foreground">Provereni pružaoci</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Početna / Home */
export function HomeScreen() {
  const quick = [
    { icon: Briefcase, label: 'Poslovi' },
    { icon: Wrench, label: 'Usluge' },
    { icon: UtensilsCrossed, label: 'Dostava' },
    { icon: Plane, label: 'Putovanja' },
  ]
  return (
    <div className="px-4 pb-5 pt-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5">
          <LogoMark className="size-6 rounded-md" />
          <span className="font-display text-xs font-bold tracking-tight text-navy">
            balkan<span className="text-primary">.works</span>
          </span>
        </span>
        <span className="grid size-7 place-items-center rounded-full bg-secondary text-primary">
          <Bell className="size-3.5" />
        </span>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-primary to-[#1e40af] p-4 text-primary-foreground">
        <p className="text-[11px] opacity-80">Ukupno stanje</p>
        <p className="mt-1 text-2xl font-bold">12.450,00 RSD</p>
        <div className="mt-3 flex gap-2">
          <span className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-white/20 py-2 text-[11px] font-semibold">
            <Plus className="size-3.5" /> Dodaj novac
          </span>
          <span className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-white/20 py-2 text-[11px] font-semibold">
            <Send className="size-3.5" /> Pošalji
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold text-navy">Kategorije</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {quick.map((q) => (
          <div key={q.label} className="flex flex-col items-center gap-1">
            <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
              <q.icon className="size-4" />
            </span>
            <span className="text-[9px] font-medium text-navy">{q.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-accent p-3">
        <p className="text-[11px] font-semibold text-navy">Wolt+ popust 20%</p>
        <p className="text-[9px] text-muted-foreground">na prvu narudžbinu</p>
      </div>
    </div>
  )
}
