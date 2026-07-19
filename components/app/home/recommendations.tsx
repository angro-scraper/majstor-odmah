'use client'

import { BusinessCard } from '@/components/app/business-card'

const RECOMMENDATIONS = [
  {
    id: 1,
    name: 'Elite Električari',
    rating: 4.9,
    reviews: 234,
    distance: '0.5 km',
    category: 'Električar',
    verified: true,
    responseTime: '< 1 sat',
  },
  {
    id: 2,
    name: 'Brzi Vodoinstalateri',
    rating: 4.8,
    reviews: 189,
    distance: '1.2 km',
    category: 'Vodoinstalater',
    verified: true,
    responseTime: '< 2 sata',
  },
  {
    id: 3,
    name: 'Pro Krečenje',
    rating: 4.7,
    reviews: 156,
    distance: '2.1 km',
    category: 'Moler',
    verified: false,
    responseTime: '24 sata',
  },
]

export function RecommendationsSection() {
  return (
    <div className="px-4 space-y-3">
      <h2 className="text-lg font-semibold text-navy">Preporučeno za tebe</h2>
      <div className="space-y-3">
        {RECOMMENDATIONS.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  )
}
