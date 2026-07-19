'use client'

import { ChevronLeft, Filter, Search } from 'lucide-react'
import Link from 'next/link'
import { useState, use } from 'react'
import { BusinessCard } from '@/components/app/business-card'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [showFilters, setShowFilters] = useState(false)
  const { slug } = use(params)
  const category = slug.replace('-', ' ').toUpperCase()

  const businesses = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `${category.slice(0, -1)} Service #${i + 1}`,
    rating: 4.5 + Math.random(),
    reviews: Math.floor(100 + Math.random() * 200),
    distance: (0.5 + Math.random() * 3).toFixed(1) + ' km',
    category: category.slice(0, -1),
    verified: Math.random() > 0.3,
    responseTime: Math.floor(1 + Math.random() * 23) + ' hours',
  }))

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background border-b border-border px-4 py-4 flex items-center justify-between">
        <Link href="/app" className="p-2 hover:bg-secondary rounded-lg transition">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold flex-1 ml-2">{category}</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 hover:bg-secondary rounded-lg transition"
        >
          <Filter className="w-6 h-6" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search in this category..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <button className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters (Collapsible) */}
      {showFilters && (
        <div className="px-4 py-4 border-b border-border bg-secondary/50 space-y-3">
          {['Distance', 'Rating', 'Price', 'Availability'].map((filter) => (
            <div key={filter}>
              <p className="text-sm font-medium mb-2">{filter}</p>
              <div className="flex gap-2">
                {['Option 1', 'Option 2', 'Option 3'].map((opt) => (
                  <button
                    key={opt}
                    className="px-2.5 py-1 text-xs rounded border border-border hover:border-primary transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="px-4 py-4">
        <p className="text-sm text-muted-foreground">{businesses.length} results found</p>
      </div>

      {/* Business List */}
      <div className="px-4 space-y-3">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  )
}
