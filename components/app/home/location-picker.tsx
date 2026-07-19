'use client'

import Link from 'next/link'
import { Crosshair, MapPin, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

const locations = {
  Srbija: ['Beograd', 'Novi Sad', 'Niš', 'Kragujevac'],
  Hrvatska: ['Zagreb', 'Split', 'Rijeka', 'Osijek'],
  'Bosna i Hercegovina': ['Sarajevo', 'Banja Luka', 'Mostar', 'Tuzla'],
  'Crna Gora': ['Podgorica', 'Nikšić', 'Budva', 'Kotor'],
  Slovenija: ['Ljubljana', 'Maribor', 'Koper', 'Celje'],
  'Severna Makedonija': ['Skoplje', 'Bitolj', 'Ohrid', 'Tetovo'],
}

const closestLocation = (latitude: number, longitude: number) => {
  if (latitude > 44 && latitude < 46 && longitude > 18 && longitude < 23) return { country: 'Srbija', city: 'Beograd' }
  if (latitude > 42 && latitude < 47 && longitude > 13 && longitude < 20) return { country: 'Hrvatska', city: 'Zagreb' }
  if (latitude > 42 && latitude < 46 && longitude > 15 && longitude < 20) return { country: 'Bosna i Hercegovina', city: 'Sarajevo' }
  return { country: 'Srbija', city: 'Beograd' }
}

export function LocationPicker() {
  const router = useRouter()
  const [country, setCountry] = useState('Srbija')
  const [city, setCity] = useState('Beograd')
  const [message, setMessage] = useState('Izaberi lokaciju za lokalne rezultate.')
  const [isLocating, setIsLocating] = useState(false)
  const cities = useMemo(() => locations[country as keyof typeof locations] ?? [], [country])

  useEffect(() => {
    const stored = window.localStorage.getItem('balkanworks-location')
    if (!stored) return
    try {
      const value = JSON.parse(stored) as { country?: string; city?: string }
      if (value.country && value.city && locations[value.country as keyof typeof locations]?.includes(value.city)) {
        setCountry(value.country)
        setCity(value.city)
        setMessage(`Prikazujemo rezultate za: ${value.city}, ${value.country}.`)
      }
    } catch {
      window.localStorage.removeItem('balkanworks-location')
    }
  }, [])

  const searchLocation = () => {
    window.localStorage.setItem('balkanworks-location', JSON.stringify({ country, city }))
    router.push(`/app/discover?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`)
  }

  const useGps = () => {
    if (!navigator.geolocation) {
      setMessage('GPS nije podržan na ovom uređaju. Izaberi državu i grad ručno.')
      return
    }
    setIsLocating(true)
    setMessage('Tražimo tvoju lokaciju…')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const detected = closestLocation(coords.latitude, coords.longitude)
        setCountry(detected.country)
        setCity(detected.city)
        window.localStorage.setItem('balkanworks-location', JSON.stringify(detected))
        setMessage(`Lokacija je postavljena na: ${detected.city}, ${detected.country}.`)
        setIsLocating(false)
      },
      () => {
        setMessage('Nismo dobili GPS dozvolu. Lokaciju možeš izabrati ručno.')
        setIsLocating(false)
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    )
  }

  return (
    <section className="mx-4 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/8 via-card to-turquoise/10 p-4 shadow-soft" aria-labelledby="location-title">
      <div className="flex items-start justify-between gap-3"><div><p className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><MapPin className="size-3.5" /> TVOJA LOKACIJA</p><h2 id="location-title" className="mt-1 text-lg font-bold text-navy">Pronađi ono što ti treba u blizini</h2></div><button type="button" onClick={useGps} disabled={isLocating} className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-primary/20 bg-card px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary disabled:opacity-60"><Crosshair className="size-4" />{isLocating ? 'Tražim…' : 'Koristi GPS'}</button></div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2"><label className="text-xs font-semibold text-navy">Država<select value={country} onChange={(event) => { const nextCountry = event.target.value; setCountry(nextCountry); setCity(locations[nextCountry as keyof typeof locations][0]); setMessage('Izaberi grad i pokreni pretragu.'); }} className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium outline-none focus:border-primary">{Object.keys(locations).map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs font-semibold text-navy">Grad<select value={city} onChange={(event) => { setCity(event.target.value); setMessage('Lokacija je spremna za pretragu.'); }} className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium outline-none focus:border-primary">{cities.map((item) => <option key={item}>{item}</option>)}</select></label></div>
      <div className="mt-3 flex flex-wrap items-center gap-2"><button type="button" onClick={searchLocation} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"><Search className="size-4" /> Pretraži u ovoj lokaciji</button><Link href="/prijava" className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-primary">Prijavi se</Link><Link href="/registracija" className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary">Napravi nalog</Link></div>
      <p role="status" className="mt-3 text-xs text-muted-foreground">{message}</p>
    </section>
  )
}
