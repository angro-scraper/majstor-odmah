'use client'

import Link from 'next/link'
import { Building2, CheckCircle2, Handshake, Landmark, LoaderCircle, Store, UsersRound } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

const partnerTypes = [
  { value: 'lokalna-firma', label: 'Lokalna firma', description: 'Profil, ponude i oglašavanje', icon: Store },
  { value: 'trgovinski-lanac', label: 'Trgovinski lanac', description: 'Flajeri, akcije i više lokacija', icon: Building2 },
  { value: 'institucija', label: 'Grad ili institucija', description: 'Lokalne usluge i zajednica', icon: Landmark },
  { value: 'tehnoloski-partner', label: 'Tehnološki partner', description: 'API i integracije', icon: Handshake },
]

const plans = [
  { id: 'start', name: 'Start', price: '0 €', description: 'Osnovni profil i prisustvo' },
  { id: 'biznis', name: 'Biznis', price: '29 € / mes.', description: 'Ponude, reklame i analitika' },
  { id: 'partner', name: 'Partner', price: 'Po dogovoru', description: 'Integracije, više lokacija i podrška' },
]

export function PartnerApplication() {
  const router = useRouter()
  const [type, setType] = useState('lokalna-firma')
  const [plan, setPlan] = useState('partner')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) return setError('Unesi naziv partnera i ispravnu email adresu.')
    setSubmitting(true)
    window.localStorage.setItem('balkanworks-partner-application', JSON.stringify({ id: `PRT-${Date.now().toString().slice(-6)}`, name, email, phone: String(form.get('phone') ?? ''), country: String(form.get('country') ?? ''), type, plan, status: 'NA_CEKANJU', submittedAt: new Date().toLocaleDateString('sr-Latn-RS') }))
    window.setTimeout(() => router.push('/partneri/status'), 400)
  }

  return <main className="min-h-screen bg-gradient-to-b from-secondary/60 to-background px-4 py-10"><div className="mx-auto max-w-3xl"><div className="flex flex-wrap items-center justify-between gap-3"><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">← Nazad na sajt</Link><Link href="/partneri/status" className="text-sm font-semibold text-navy hover:text-primary">Proveri status prijave</Link></div><header className="mt-8"><p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><UsersRound className="size-3.5" /> PARTNER PROGRAM</p><h1 className="mt-4 text-4xl font-bold tracking-tight text-navy">Postanite partner Balkan.works</h1><p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">Povežite svoj biznis, kampanje ili sistem sa lokalnom mrežom korisnika. Svaka prijava prolazi administrativnu proveru pre objave.</p></header><form onSubmit={submit} className="mt-8 space-y-6 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7"><section><h2 className="font-semibold text-navy">Tip partnerstva</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{partnerTypes.map((item) => { const Icon = item.icon; const active = type === item.value; return <button key={item.value} type="button" onClick={() => setType(item.value)} aria-pressed={active} className={`rounded-2xl border p-4 text-left transition ${active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}><Icon className="size-5 text-primary" /><p className="mt-3 font-semibold text-navy">{item.label}</p><p className="mt-1 text-sm text-muted-foreground">{item.description}</p></button> })}</div></section><section className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-navy">Naziv organizacije<input required name="name" placeholder="Naziv firme ili organizacije" className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label><label className="text-sm font-semibold text-navy">Kontakt osoba<input required name="contact" placeholder="Ime i prezime" className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label><label className="text-sm font-semibold text-navy">Email<input required name="email" type="email" placeholder="partner@firma.com" className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label><label className="text-sm font-semibold text-navy">Telefon<input name="phone" type="tel" placeholder="+381 ..." className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label><label className="text-sm font-semibold text-navy">Država<select name="country" defaultValue="Srbija" className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"><option>Srbija</option><option>Hrvatska</option><option>Bosna i Hercegovina</option><option>Crna Gora</option><option>Slovenija</option><option>Severna Makedonija</option></select></label><label className="text-sm font-semibold text-navy">Sajt ili profil<input name="website" placeholder="https://" className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label></section><section><h2 className="font-semibold text-navy">Paket i monetizacija</h2><div className="mt-3 grid gap-3 sm:grid-cols-3">{plans.map((item) => { const active = plan === item.id; return <button type="button" key={item.id} onClick={() => setPlan(item.id)} aria-pressed={active} className={`rounded-2xl border p-4 text-left transition ${active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}><p className="font-semibold text-navy">{item.name}</p><p className="mt-1 text-lg font-bold text-primary">{item.price}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p></button> })}</div></section><label className="block text-sm font-semibold text-navy">Kako želite da sarađujete?<textarea name="message" rows={4} placeholder="Opišite svoju mrežu, kampanju ili sistem koji želite da povežete." className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label>{error ? <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p> : null}<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><p className="flex max-w-md items-center gap-2 text-xs leading-5 text-muted-foreground"><CheckCircle2 className="size-4 shrink-0 text-turquoise" />Prijava se šalje na administrativnu proveru. Objave i reklame nisu aktivne pre odobrenja.</p><button disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}{submitting ? 'Šaljem prijavu…' : 'Pošalji prijavu'}</button></div></form></div></main>
}
