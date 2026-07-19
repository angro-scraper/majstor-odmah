'use client'

import { useEffect, useMemo, useState } from 'react'
import { Building2, CheckCircle2, Clock3, Mail, ShieldCheck, XCircle, type LucideIcon } from 'lucide-react'

type Status = 'NA_CEKANJU' | 'ODOBREN' | 'ODBIJEN'
type Partner = { id: string; name: string; type: string; contact: string; plan: string; submitted: string; status: Status }
type StoredPartner = { id: string; name: string; type: string; plan: string; status: Status; submittedAt: string; contact?: string }

const initialPartners: Partner[] = [
  { id: 'PRT-10482', name: 'Pekara Dunav', type: 'Lokalna firma', contact: 'Milica Petrović', plan: 'Biznis', submitted: 'Danas, 09:42', status: 'NA_CEKANJU' },
  { id: 'PRT-10477', name: 'Grad Novi Sad', type: 'Grad ili institucija', contact: 'Marko Jovanović', plan: 'Partner', submitted: 'Juče, 15:18', status: 'NA_CEKANJU' },
  { id: 'PRT-10455', name: 'Regional Market', type: 'Trgovinski lanac', contact: 'Ana Marković', plan: 'Partner', submitted: '17. jul', status: 'ODOBREN' },
]

const statusText: Record<Status, string> = { NA_CEKANJU: 'Na čekanju', ODOBREN: 'Odobren', ODBIJEN: 'Odbijen' }
const statusClass: Record<Status, string> = { NA_CEKANJU: 'bg-amber-50 text-amber-700', ODOBREN: 'bg-emerald-50 text-emerald-700', ODBIJEN: 'bg-rose-50 text-rose-700' }
type Stat = { value: number; label: string; Icon: LucideIcon; color: string }

export default function AdminPartneriPage() {
  const [partners, setPartners] = useState(initialPartners)
  const [filter, setFilter] = useState<'SVE' | Status>('NA_CEKANJU')
  const [message, setMessage] = useState('')
  useEffect(() => {
    const stored = window.localStorage.getItem('balkanworks-partner-application')
    if (!stored) return
    try {
      const application = JSON.parse(stored) as StoredPartner
      if (!application.id || !application.name) return
      setPartners((items) => items.some((item) => item.id === application.id) ? items : [{ id: application.id, name: application.name, type: application.type, contact: application.contact || 'Nije navedeno', plan: application.plan, submitted: application.submittedAt, status: application.status || 'NA_CEKANJU' }, ...items])
    } catch { /* Neispravna lokalna prijava se ignoriše. */ }
  }, [])
  const filtered = useMemo(() => filter === 'SVE' ? partners : partners.filter((partner) => partner.status === filter), [filter, partners])
  const update = (id: string, status: Status) => {
    const partner = partners.find((item) => item.id === id)
    setPartners((items) => items.map((item) => item.id === id ? { ...item, status } : item))
    const stored = window.localStorage.getItem('balkanworks-partner-application')
    if (stored) {
      try {
        const application = JSON.parse(stored) as StoredPartner
        if (application.id === id) window.localStorage.setItem('balkanworks-partner-application', JSON.stringify({ ...application, status }))
      } catch { /* Lokalni status ostaje nepromenjen ako zapis nije validan. */ }
    }
    setMessage(`${partner?.name ?? 'Partner'} je ${status === 'ODOBREN' ? 'odobren' : 'odbijen'}.`)
  }
  const pending = partners.filter((partner) => partner.status === 'NA_CEKANJU').length
  const stats: Stat[] = [
    { value: pending, label: 'Na čekanju', Icon: Clock3, color: 'text-amber-600' },
    { value: partners.filter((partner) => partner.status === 'ODOBREN').length, label: 'Aktivni partneri', Icon: CheckCircle2, color: 'text-emerald-600' },
    { value: partners.filter((partner) => partner.status === 'ODBIJEN').length, label: 'Odbijene prijave', Icon: XCircle, color: 'text-rose-600' },
  ]

  return <main className="space-y-7">
    <section><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-blue-600"><ShieldCheck className="h-4 w-4" /> Partner mreža</p><h1 className="mt-2 text-3xl font-black tracking-tight text-[#142f63]">Odobravanje partnera</h1><p className="mt-2 text-slate-500">Proverite identitet, paket i dozvole pre aktivacije partnera.</p></section>
    <section className="grid gap-4 sm:grid-cols-3">{stats.map(({ value, label, Icon, color }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-sm text-slate-500"><Icon className={`h-4 w-4 ${color}`} />{label}</div><p className="mt-2 text-3xl font-black text-[#142f63]">{value}</p></div>)}</section>
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap gap-2">{(['NA_CEKANJU', 'ODOBREN', 'ODBIJEN', 'SVE'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-sm font-bold ${filter === item ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-50'}`}>{item === 'SVE' ? 'Sve prijave' : statusText[item]}</button>)}</div>{message && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p>}<div className="mt-5 space-y-3">{filtered.map((partner) => <article key={partner.id} className="rounded-2xl border border-slate-200 p-5"><div className="flex flex-col justify-between gap-4 md:flex-row"><div><div className="flex items-center gap-2"><div className="rounded-xl bg-blue-50 p-2 text-blue-600"><Building2 className="h-5 w-5" /></div><div><h2 className="font-extrabold text-[#142f63]">{partner.name}</h2><p className="text-sm text-slate-500">{partner.type} · {partner.id}</p></div></div><div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500"><span className="flex items-center gap-1"><Mail className="h-4 w-4" />{partner.contact}</span><span>Paket: <strong className="text-slate-700">{partner.plan}</strong></span><span>Poslato: {partner.submitted}</span></div></div><div className="flex flex-wrap items-start gap-2"><span className={`rounded-full px-3 py-2 text-xs font-bold ${statusClass[partner.status]}`}>{statusText[partner.status]}</span>{partner.status === 'NA_CEKANJU' && <><button onClick={() => update(partner.id, 'ODOBREN')} className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700">Odobri</button><button onClick={() => update(partner.id, 'ODBIJEN')} className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50">Odbij</button></>}</div></div></article>)}{filtered.length === 0 && <div className="py-10 text-center text-slate-500">Nema prijava u ovom statusu.</div>}</div></section>
  </main>
}
