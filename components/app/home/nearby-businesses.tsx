'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'

export function NearbyBusinesses() {
  return (
    <div className="px-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">U blizini</h2>
        <Link href="/app/discover" className="text-sm text-primary hover:underline">Otkrij u blizini</Link>
      </div>
      <div className="h-40 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Mapa uskoro stiže</p>
        </div>
      </div>
    </div>
  )
}
