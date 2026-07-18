'use client'

import { TrendingUp } from 'lucide-react'

export function TrendingSection() {
  return (
    <div className="px-4 space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Trending Now
      </h2>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Trending Service #{i}</span>
              <span className="text-xs text-primary font-semibold">↑ 12%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">2,340 searches this week</p>
          </div>
        ))}
      </div>
    </div>
  )
}
