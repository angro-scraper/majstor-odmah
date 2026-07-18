'use client'

import { ReactNode } from 'react'
import { BottomNavigation } from '@/components/app/bottom-navigation'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20">
        <div className="max-w-3xl mx-auto w-full">
          {children}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}
