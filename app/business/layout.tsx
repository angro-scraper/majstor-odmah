'use client'

import Link from 'next/link'
import { BarChart3, Settings, LogOut, Menu, MessageSquare, Tags } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function BusinessLayout({
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
          <Link href="/business" className="flex items-center gap-2 font-bold text-lg">
            <BarChart3 className="w-6 h-6 text-primary" />
            balkan.works
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Business</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { label: 'Dashboard', href: '/business', icon: BarChart3 },
            { label: 'Analytics', href: '/business/analytics', icon: BarChart3 },
            { label: 'Leads', href: '/business/leads', icon: BarChart3 },
            { label: 'Ponude', href: '/business/offers', icon: Tags },
            { label: 'Messages', href: '/business/messages', icon: MessageSquare },
            { label: 'AI Coach', href: '/business/ai-coach', icon: BarChart3 },
            { label: 'Settings', href: '/business/settings', icon: Settings },
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
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-destructive/50 text-destructive text-sm font-medium hover:bg-destructive/10 transition">
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
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

          <div className="md:hidden text-lg font-bold">balkan.works</div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
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
