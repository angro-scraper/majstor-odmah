'use client'

import { DollarSign, Plus, X } from 'lucide-react'
import { FormEvent, useState } from 'react'

type Request = { id: number; title: string; description: string; category: string; status: 'quoted' | 'pending'; quotes: number; date: string }

const initialRequests: Request[] = [
  { id: 1, title: 'Popravka sudopere', description: 'Sudopera curi i potreban je pregled.', category: 'Vodoinstalater', status: 'quoted', quotes: 3, date: 'Pre 2 sata' },
  { id: 2, title: 'Krečenje spavaće sobe', description: 'Dve sobe, svetla boja, potreban termin ove nedelje.', category: 'Majstori za dom', status: 'pending', quotes: 0, date: 'Juče' },
  { id: 3, title: 'Zamena svetiljki', description: 'Potrebna zamena četiri svetiljke u hodniku.', category: 'Električar', status: 'quoted', quotes: 2, date: 'Pre 3 dana' },
]

export default function RequestsPage() {
  const [requests, setRequests] = useState(initialRequests)
  const [showForm, setShowForm] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !description.trim()) return
    setRequests((current) => [{ id: Date.now(), title: title.trim(), description: description.trim(), category: 'Lokalna usluga', status: 'pending', quotes: 0, date: 'Upravo sada' }, ...current])
    setTitle(''); setDescription(''); setShowForm(false)
  }

  return (
    <div className="space-y-6 px-4 py-6 pb-24">
      <header className="flex items-start justify-between gap-3"><div><h1 className="text-3xl font-bold text-navy">Zahtevi za usluge</h1><p className="mt-1 text-muted-foreground">Objavi potrebu i uporedi ponude lokalnih profesionalaca.</p></div><button type="button" onClick={() => setShowForm(true)} className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"><Plus className="size-4" /> Novi zahtev</button></header>

      {showForm ? <form onSubmit={submitRequest} className="space-y-3 rounded-2xl border border-primary/25 bg-primary/5 p-4"><div className="flex items-center justify-between"><h2 className="font-semibold text-navy">Opiši šta ti treba</h2><button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-card" aria-label="Zatvori formu"><X className="size-5" /></button></div><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Na primer: popravka bojlera" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary" /><textarea required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Dodaj detalje, lokaciju i željeni termin." rows={3} className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary" /><button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Objavi zahtev</button></form> : null}

      <div className="grid grid-cols-3 gap-3">{[{ label: 'Ukupno', value: requests.length }, { label: 'Ponude čekaju', value: requests.filter((item) => item.quotes > 0).length }, { label: 'Završeno', value: 5 }].map((stat) => <div key={stat.label} className="rounded-2xl border border-border bg-card p-3"><p className="text-xs text-muted-foreground">{stat.label}</p><p className="mt-1 text-lg font-bold text-navy">{stat.value}</p></div>)}</div>

      <section className="space-y-3">{requests.map((request) => <article key={request.id} className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"><div className="mb-3 flex items-start justify-between gap-3"><div><h2 className="flex flex-wrap items-center gap-2 font-semibold text-navy">{request.title}<span className={`rounded px-2 py-0.5 text-xs font-semibold ${request.status === 'quoted' ? 'bg-turquoise/15 text-turquoise' : 'bg-primary/10 text-primary'}`}>{request.status === 'quoted' ? 'Ima ponude' : 'Objavljeno'}</span></h2><p className="mt-1 text-sm text-muted-foreground">{request.description}</p></div></div><p className="text-sm text-muted-foreground">{request.category} · {request.date}</p><div className="mt-3 flex items-center justify-between border-t border-border pt-3">{request.quotes > 0 ? <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy"><DollarSign className="size-4 text-primary" />{request.quotes} ponude</span> : <span className="text-sm text-muted-foreground">Tražimo dostupne profesionalce</span>}<button type="button" onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">{selectedRequest === request.id ? 'Sakrij' : request.quotes ? 'Pogledaj ponude' : 'Detalji'}</button></div>{selectedRequest === request.id ? <div className="mt-3 rounded-xl bg-secondary/70 p-3 text-sm"><p className="font-semibold text-navy">{request.quotes ? 'Ponude su spremne za poređenje' : 'Zahtev je aktivan'}</p><p className="mt-1 text-muted-foreground">{request.quotes ? 'Otvorite poruke da dogovorite termin sa profesionalcem.' : 'Obavestićemo te čim stigne prva relevantna ponuda.'}</p></div> : null}</article>)}</section>
    </div>
  )
}
