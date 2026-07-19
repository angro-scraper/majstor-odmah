'use client'

import Link from 'next/link'
import { Star, MapPin, Clock, CheckCircle, Bookmark } from 'lucide-react'

interface BusinessCardProps {
  business: {
    id: number
    name: string
    rating: number
    reviews: number
    distance: string
    category: string
    verified?: boolean
    responseTime?: string
  }
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Link href={`/app/business/${business.id}`}>
      <div className="p-4 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{business.name}</h3>
              {business.verified && (
                <CheckCircle className="w-4 h-4 text-primary fill-primary/20" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{business.category}</p>
          </div>
          <button className="p-2 hover:bg-secondary rounded-lg transition">
            <Bookmark className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold">{business.rating}</span>
            <span className="text-xs text-muted-foreground">({business.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {business.distance}
          </div>
        </div>

        {business.responseTime && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1.5 rounded-lg w-fit">
            <Clock className="w-3.5 h-3.5" />
            {business.responseTime}
          </div>
        )}
      </div>
    </Link>
  )
}
