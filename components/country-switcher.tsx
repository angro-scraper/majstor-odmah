'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { REGIONAL_COUNTRIES, type RegionalCountryCode } from '@/lib/regional'

const STORAGE_KEY = 'bw-country'

/** Client preference selector. Server data remains scoped by the active API query. */
export function CountrySwitcher() {
  const [country, setCountry] = useState<RegionalCountryCode>('RS')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as RegionalCountryCode | null
    if (stored && REGIONAL_COUNTRIES.some((item) => item.code === stored)) setCountry(stored)
  }, [])

  return (
    <label className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-2 text-sm font-semibold text-navy transition-colors hover:border-primary/40">
      <MapPin className="size-4 text-primary" />
      <select
        value={country}
        onChange={(event) => {
          const next = event.target.value as RegionalCountryCode
          setCountry(next)
          window.localStorage.setItem(STORAGE_KEY, next)
        }}
        aria-label="Izaberite državu"
        className="max-w-24 appearance-none bg-transparent pr-1 text-sm outline-none"
      >
        {REGIONAL_COUNTRIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
      </select>
    </label>
  )
}
