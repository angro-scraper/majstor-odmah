'use client'

import { Sparkles } from 'lucide-react'

export function OffersCarousel() {
  return (
    <div className="px-4 space-y-3 pb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500" />
        Special Offers
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 snap-start cursor-pointer hover:border-primary transition"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-bold text-primary">SAVE 30%</span>
              <span className="text-xs text-muted-foreground">Limited time</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Special Offer #{i}</h3>
            <p className="text-xs text-muted-foreground mb-3">Valid until tomorrow</p>
            <button className="w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition">
              Claim Offer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
