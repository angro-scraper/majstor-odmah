'use client'

import Link from 'next/link'
import {
  Wrench,
  UtensilsCrossed,
  Zap,
  Stethoscope,
  Home,
  Dumbbell,
  Scissors,
  BookOpen,
  Plane,
  PawPrint,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { name: 'Usluge za dom', icon: Wrench, href: '/app/category/home-services', color: 'bg-blue-500/10 text-blue-600' },
  { name: 'Hrana', icon: UtensilsCrossed, href: '/app/category/food', color: 'bg-orange-500/10 text-orange-600' },
  { name: 'Auto usluge', icon: Zap, href: '/app/category/auto', color: 'bg-red-500/10 text-red-600' },
  { name: 'Zdravlje', icon: Stethoscope, href: '/app/category/health', color: 'bg-green-500/10 text-green-600' },
  { name: 'Nekretnine', icon: Home, href: '/app/category/real-estate', color: 'bg-purple-500/10 text-purple-600' },
  { name: 'Sport', icon: Dumbbell, href: '/app/category/sports', color: 'bg-indigo-500/10 text-indigo-600' },
  { name: 'Lepota', icon: Scissors, href: '/app/category/beauty', color: 'bg-pink-500/10 text-pink-600' },
  { name: 'Edukacija', icon: BookOpen, href: '/app/category/education', color: 'bg-cyan-500/10 text-cyan-600' },
  { name: 'Putovanja', icon: Plane, href: '/app/category/travel', color: 'bg-amber-500/10 text-amber-600' },
  { name: 'Kućni ljubimci', icon: PawPrint, href: '/app/category/pet', color: 'bg-yellow-500/10 text-yellow-600' },
  { name: 'Događaji', icon: TrendingUp, href: '/app/category/events', color: 'bg-violet-500/10 text-violet-600' },
]

export function CategoriesGrid() {
  return (
    <div className="px-4 space-y-3">
      <h2 className="text-lg font-semibold">Kategorije</h2>
      <div className="grid grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.name}
              href={cat.href}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-2xl border border-border hover:border-primary transition',
                cat.color
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium text-center line-clamp-2">{cat.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
