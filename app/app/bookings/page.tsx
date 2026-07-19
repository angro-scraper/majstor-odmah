'use client'

import Link from 'next/link'
import { Calendar, Clock, MessageSquare, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

type Booking = {
  id: number
  service: string
  business: string
  businessId: number
  date: string
  time: string
  status: 'confirmed' | 'pending'
  price: string
}

const initialBookings: Booking[] = [
  { id: 1, service: 'Popravka elektroinstalacija', business: 'Elite Električari', businessId: 1, date: '20. januar', time: '10:00', status: 'confirmed', price: '14.000 RSD' },
  { id: 2, service: 'Vodoinstalaterska usluga', business: 'Brzi Vodoinstalateri', businessId: 2, date: '22. januar', time: '14:00', status: 'pending', price: '9.950 RSD' },
  { id: 3, service: 'Krečenje stana', business: 'Pro Krečenje', businessId: 3, date: '25. januar', time: '09:00', status: 'confirmed', price: '52.500 RSD' },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState(initialBookings)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('package')) setNotice('Paket je rezervisan. Potvrdu i kod za preuzimanje dobijaš u porukama.')
  }, [])

  const updateBooking = (id: number, nextStatus: Booking['status'], message: string) => {
    setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status: nextStatus } : booking))
    setNotice(message)
  }

  const confirmed = bookings.filter((booking) => booking.status === 'confirmed').length
  const pending = bookings.filter((booking) => booking.status === 'pending').length

  return (
    <div className="space-y-6 px-4 py-6 pb-24">
      <header>
        <h1 className="text-3xl font-bold text-navy">Moje rezervacije</h1>
        <p className="mt-1 text-muted-foreground">Prati predstojeće usluge i potvrdi termin kada ti odgovara.</p>
      </header>

      {notice ? <div role="status" className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-navy">{notice}</div> : null}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Potvrđeno', value: confirmed, color: 'bg-turquoise/10 text-turquoise' },
          { label: 'Čeka potvrdu', value: pending, color: 'bg-secondary text-primary' },
          { label: 'Ukupno', value: 12, color: 'bg-primary/10 text-primary' },
        ].map((stat) => <div key={stat.label} className={`rounded-2xl border border-border p-3 ${stat.color}`}><p className="text-xs font-medium opacity-80">{stat.label}</p><p className="mt-1 text-xl font-bold">{stat.value}</p></div>)}
      </div>

      <section className="space-y-3">
        {bookings.map((booking) => {
          const confirmedBooking = booking.status === 'confirmed'
          return <article key={booking.id} className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div><h2 className="font-semibold text-navy">{booking.service}</h2><Link href={`/app/business/${booking.businessId}`} className="mt-0.5 inline-block text-sm text-muted-foreground hover:text-primary">{booking.business}</Link></div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${confirmedBooking ? 'bg-turquoise/15 text-turquoise' : 'bg-primary/10 text-primary'}`}>{confirmedBooking ? 'Potvrđeno' : 'Čeka potvrdu'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Calendar className="size-4" />{booking.date}</span><span className="flex items-center gap-2"><Clock className="size-4" />{booking.time}</span></div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3"><span className="text-sm font-semibold text-primary">{booking.price}</span><div className="flex gap-2">{confirmedBooking ? <button type="button" onClick={() => setNotice('Zahtev za pomeranje termina je pripremljen. Firma će ti uskoro odgovoriti u porukama.')} className="inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium transition hover:bg-secondary/80"><RotateCcw className="size-3.5" /> Promeni termin</button> : <button type="button" onClick={() => updateBooking(booking.id, 'confirmed', 'Termin je potvrđen i dodat u tvoje rezervacije.')} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90">Potvrdi</button>}<Link href={`/app/messages?business=${booking.businessId}`} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-navy transition hover:border-primary"><MessageSquare className="size-3.5" /> Poruka</Link></div></div>
          </article>
        })}
      </section>
    </div>
  )
}
