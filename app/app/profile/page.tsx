'use client'

import { User, Settings, MapPin, Star, Activity, LogOut } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account</p>
        </div>
        <button className="p-3 rounded-full bg-secondary border border-border hover:border-primary transition">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Marko Marković</h2>
            <p className="text-sm text-muted-foreground">marko@example.com</p>
            <p className="text-xs text-muted-foreground mt-1">Member since Jan 2024</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
          <p className="text-2xl font-bold text-primary">24</p>
          <p className="text-xs text-muted-foreground mt-1">Bookings</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
          <p className="text-2xl font-bold text-primary">4.8</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <Star className="w-3 h-3" /> Rating
          </p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
          <p className="text-2xl font-bold text-primary">12</p>
          <p className="text-xs text-muted-foreground mt-1">Reviews</p>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {[
          { label: 'Saved Places', icon: MapPin },
          { label: 'Booking History', icon: Activity },
          { label: 'Settings', icon: Settings },
        ].map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary transition text-left"
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 transition">
        <LogOut className="w-5 h-5" />
        Log Out
      </button>
    </div>
  )
}
