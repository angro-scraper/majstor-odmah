'use client'

import { Bell, MapPin } from 'lucide-react'
import Link from 'next/link'

export function WelcomeHeader() {
  return (
    <div className="px-4 flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          Beograd, Srbija
        </p>
        <h1 className="text-3xl font-bold mt-1">Dobro došao/la!</h1>
        <p className="text-sm text-muted-foreground mt-1">Šta ti je danas potrebno?</p>
      </div>
      <Link href="/app/messages" aria-label="Otvori poruke" className="p-3 rounded-full bg-card border border-border hover:border-primary transition">
        <Bell className="w-5 h-5" />
      </Link>
    </div>
  )
}
