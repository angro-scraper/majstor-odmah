'use client'

import { User, Settings, MapPin, Star, Activity, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profil</h1>
          <p className="text-muted-foreground mt-1">Upravljaj svojim nalogom</p>
        </div>
        <Link href="/app/rewards" className="p-3 rounded-full bg-secondary border border-border hover:border-primary transition" aria-label="Balkan Rewards">
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      <Link href="/app/rewards" className="flex items-center justify-between rounded-2xl border border-primary/15 bg-primary/5 p-4 transition hover:border-primary/40">
        <div><p className="text-xs font-semibold uppercase tracking-wide text-primary">Balkan Rewards</p><p className="mt-1 font-semibold text-navy">Explorer · 280 poena</p><p className="mt-1 text-sm text-muted-foreground">Otvori nagrade i lokalne pogodnosti.</p></div><span className="text-primary">→</span>
      </Link>

      {/* User Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Marko Marković</h2>
            <p className="text-sm text-muted-foreground">marko@example.com</p>
            <p className="text-xs text-muted-foreground mt-1">Član od januara 2024.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
          <p className="text-2xl font-bold text-primary">24</p>
          <p className="text-xs text-muted-foreground mt-1">Termini</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
          <p className="text-2xl font-bold text-primary">4.8</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <Star className="w-3 h-3" /> Ocena
          </p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
          <p className="text-2xl font-bold text-primary">12</p>
          <p className="text-xs text-muted-foreground mt-1">Recenzije</p>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {[
          { label: 'Sačuvana mesta', icon: MapPin, href: '/app/saved' },
          { label: 'Istorija termina', icon: Activity, href: '/app/bookings' },
          { label: 'Nagrade i pogodnosti', icon: Settings, href: '/app/rewards' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary transition text-left"
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 transition">
        <LogOut className="w-5 h-5" />
        Odjavi se
      </button>
    </div>
  )
}
