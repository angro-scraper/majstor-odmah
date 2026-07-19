'use client'

import Link from 'next/link'
import { Shield, Users, AlertCircle, CheckCircle, Settings, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0 md:z-auto`}
      >
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
            <Shield className="w-6 h-6 text-destructive" />
            Administratorski panel
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { label: 'Kontrolna tabla', href: '/admin', icon: Shield },
            { label: 'Moderacija', href: '/admin/moderation', icon: AlertCircle },
            { label: 'Verifikacija', href: '/admin/verification', icon: CheckCircle },
            { label: 'Korisnici', href: '/admin/users', icon: Users },
            { label: 'Firme', href: '/admin/businesses', icon: Shield },
            { label: 'Podešavanja', href: '/admin/settings', icon: Settings },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium transition"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link href="/" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-destructive/50 text-destructive text-sm font-medium hover:bg-destructive/10 transition">
            <LogOut className="w-4 h-4" />
            Odjavi se
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="md:hidden text-lg font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-destructive" />
            Administracija
          </div>

          <Link href="/app" className="text-sm font-semibold text-primary hover:underline">Otvori aplikaciju</Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
