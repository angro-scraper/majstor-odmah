'use client'

import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

const TRENDING = [
  { title: 'Majstori za dom', searches: '2.340 pretraga ove nedelje', href: '/app/category/home-services' },
  { title: 'Lokalne ponude za hranu', searches: '1.870 pregleda danas', href: '/app/deals' },
  { title: 'Sačuvaj hranu u blizini', searches: '32 paketa spremna za preuzimanje', href: '/app/save-food' },
]

export function TrendingSection() {
  return (
    <div className="px-4 space-y-3">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Trending Now
      </h2>
      <div className="space-y-2">
        {TRENDING.map((item) => (
          <Link key={item.title} href={item.href} className="block p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary transition">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-navy">{item.title}</span>
              <span className="text-xs text-primary font-semibold">↑ 12%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{item.searches}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
