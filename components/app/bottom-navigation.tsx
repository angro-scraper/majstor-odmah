'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Compass, MessageSquare, Bookmark, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/app', label: 'Home', icon: Home },
  { href: '/app/discover', label: 'Discover', icon: Compass },
  { href: '/app/ai', label: 'AI', icon: MessageSquare, highlight: true },
  { href: '/app/saved', label: 'Saved', icon: Bookmark },
  { href: '/app/profile', label: 'Profile', icon: User },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href === '/app' && pathname === '/app')
          const isHighlight = item.highlight

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
                isHighlight && 'ring-2 ring-primary/30 bg-primary/10'
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && isHighlight && (
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
