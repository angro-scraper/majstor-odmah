'use client'

import { ReactNode } from 'react'
import { BottomNavigation } from '@/components/app/bottom-navigation'
import { AppBackButton } from '@/components/app/app-back-button'

export default function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-auto pb-20">
        <div className="max-w-3xl mx-auto w-full">
          <AppBackButton />
          {children}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
