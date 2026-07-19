'use client'

import { useMemo, useState } from 'react'
import { BadgeEuro, CheckCircle2, ImageIcon, Megaphone, ShieldAlert, type LucideIcon } from 'lucide-react'

type Status = 'NA_CEKANJU' | 'ODOBRENA' | 'ODBIJENA'
type Advertisement = { id: string; title: string; partner: string; placement: string; budget: string; status: Status }
const initialAds: Advertisement[] = [
  { id: 'AD-8031', title: 'Vikend akcija: 20% na ručak', partner: 'Restoran Dunav', placement: 'Početni ekran · Beograd', budget: '120 €', status: 'NA_CEKANJU' },
  { id: 'AD-8028', title: 'Pekarski Save Food paketi', partner: 'Pekara Zrno', placement: 'Save Food · Novi Sad', budget: '85 €', status: 'NA_CEKANJU' },
  { id: 'AD-8013', title: 'Besplatna dijagnostika vozila', partner: 'Auto Plus', placement: 'Auto kategorija · Beograd', budget: '160 €', status: 'ODOBRENA' },
]
const label: Record<Status, string> = { NA_CEKANJU: 'Na čekanju', ODOBRENA: 'Odobrena', ODBIJENA: 'Odbijena' }
const styles: Record<Status, string> = { NA_CEKANJU: 'bg-amber-50 text-amber-700', ODOBRENA: 'bg-emerald-50 text-emerald-700', ODBIJENA: 'bg-rose-50 text-rose-700' }
type Stat = { value: number | string; label: string; Icon: LucideIcon; color: string }

export default function AdminReklamePage() {
  const [ads, setAds] = useState(initialAds)
  const [filter, setFilter] = useState<'SVE' | Status>('NA_CEKANJU')
  const [notice, setNotice] = useState('')
  const filtered = useMemo(() => filter === 'SVE' ? ads : ads.filter((ad) => ad.status === filter), [ads, filter])
  const update = (id: string, status: Status) => { const ad = ads.find((item) => item.id === id); setAds((items) => items.map((item) => item.id === id ? { ...item, status } : item)); setNotice(`Reklama „${ad?.title ?? ''}” je ${status === 'ODOBRENA' ? 'odobrena za prikazivanje' : 'odbijena'}.`) }
  const stats: Stat[] = [
    { value: ads.filter((ad) => ad.status === 'NA_CEKANJU').length, label: 'Kampanje na čekanju', Icon: ShieldAlert, color: 'text-amber-600' },
    { value: ads.filter((ad) => ad.status === 'ODOBRENA').length, label: 'Aktivne reklame', Icon: CheckCircle2, color: 'text-emerald-600' },
    { value: '365 €', label: 'Odobreni budžet', Icon: BadgeEuro, color: 'text-blue-600' },
  ]
  return <main className="space-y-7">
    <section><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-blue-600"><Megaphone className="h-4 w-4" /> Monetizacija</p><h1 className="mt-2 text-3xl font-black tracking-tight text-[#142f63]">Kontrola reklama</h1><p className="mt-2 text-slate-500">Odobrite samo jasne, relevantne i lokalno korisne kampanje.</p></section>
    <section className="grid gap-4 sm:grid-cols-3">{stats.map(({ value, label: statLabel, Icon, color }) => <div key={statLabel} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-sm text-slate-500"><Icon className={`h-4 w-4 ${color}`} />{statLabel}</div><p className="mt-2 text-3xl font-black text-[#142f63]">{value}</p></div>)}</section>
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap gap-2">{(['NA_CEKANJU', 'ODOBRENA', 'ODBIJENA', 'SVE'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-sm font-bold ${filter === item ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50'}`}>{item === 'SVE' ? 'Sve reklame' : label[item]}</button>)}</div>{notice && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>}<div className="mt-5 space-y-3">{filtered.map((ad) => <article key={ad.id} className="rounded-2xl border border-slate-200 p-5"><div className="flex flex-col justify-between gap-4 lg:flex-row"><div className="flex gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><ImageIcon className="h-5 w-5" /></div><div><h2 className="font-extrabold text-[#142f63]">{ad.title}</h2><p className="mt-1 text-sm text-slate-500">{ad.partner} · {ad.id}</p><p className="mt-2 text-sm text-slate-600">{ad.placement} <span className="mx-2 text-slate-300">•</span> Budžet: <strong>{ad.budget}</strong></p></div></div><div className="flex flex-wrap items-start gap-2"><span className={`rounded-full px-3 py-2 text-xs font-bold ${styles[ad.status]}`}>{label[ad.status]}</span>{ad.status === 'NA_CEKANJU' && <><button onClick={() => update(ad.id, 'ODOBRENA')} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700">Odobri reklamu</button><button onClick={() => update(ad.id, 'ODBIJENA')} className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50">Odbij</button></>}</div></div></article>)}{filtered.length === 0 && <div className="py-10 text-center text-slate-500">Nema reklama u ovom statusu.</div>}</div></section>
  </main>
}
