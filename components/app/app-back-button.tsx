'use client'

import { ChevronLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export function AppBackButton() {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/app'

  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(isHome ? '/' : '/app')
  }

  return (
    <div className="sticky top-0 z-30 flex h-12 items-center border-b border-border/70 bg-background/95 px-4 backdrop-blur">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-navy transition hover:bg-secondary"
        aria-label={isHome ? 'Nazad na početnu stranicu sajta' : 'Nazad na prethodnu stranicu'}
      >
        <ChevronLeft className="size-4" />
        {isHome ? 'Početna stranica' : 'Nazad'}
      </button>
    </div>
  )
}
