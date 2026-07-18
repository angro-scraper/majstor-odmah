'use client'

import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/config'

const DOWNLOAD_ON: Record<Locale, string> = {
  sr: 'Preuzmi na',
  hr: 'Preuzmi na',
  bs: 'Preuzmi na',
  me: 'Preuzmi na',
  mk: 'Преземи на',
  sl: 'Prenesi na',
  bg: 'Изтегли от',
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.417 2.2-1.11 2.98-.75.85-1.98 1.5-3.02 1.42-.13-1.1.42-2.27 1.08-3 .75-.83 2.05-1.44 3.05-1.4zM20.5 17.1c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.4 3.53-4.14 3.54-1.55.02-1.95-1.01-4.05-1-2.1.01-2.54 1.02-4.1 1-1.74-.02-3.07-1.78-4.06-3.35C-.14 17.78-.42 12.9 1.24 10.3c1.18-1.85 3.04-2.94 4.79-2.94 1.78 0 2.9 1 4.37 1 1.43 0 2.3-1 4.36-1 1.56 0 3.21.85 4.39 2.32-3.86 2.11-3.23 7.62 1.35 9.42z" />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3.6 2.3 13.4 12 3.6 21.7c-.36-.2-.6-.6-.6-1.1V3.4c0-.5.24-.9.6-1.1z" fill="#2563eb" />
      <path d="M17.3 8.2 13.4 12l3.9 3.8 3.1-1.8c.9-.5.9-1.7 0-2.2l-3.1-1.6z" fill="#06b6d4" />
      <path d="M3.6 2.3c.3-.17.68-.16 1.02.04L17.3 8.2 13.4 12 3.6 2.3z" fill="#14b8a6" />
      <path d="M3.6 21.7 13.4 12l3.9 3.8-12.68 5.86c-.34.2-.72.21-1.02.04z" fill="#1e40af" />
    </svg>
  )
}

export function StoreButtons({ className }: { className?: string }) {
  const { locale } = useI18n()
  const downloadOn = DOWNLOAD_ON[locale]

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <a
        href="/preuzmi"
        className="group inline-flex items-center gap-3 rounded-2xl bg-navy px-5 py-3 text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        <AppleIcon className="size-6" />
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-medium opacity-80">{downloadOn}</span>
          <span className="text-sm font-semibold">App Store</span>
        </span>
      </a>
      <a
        href="/preuzmi"
        className="group inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 text-navy transition-transform hover:-translate-y-0.5"
      >
        <PlayIcon className="size-6" />
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-medium text-muted-foreground">{downloadOn}</span>
          <span className="text-sm font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  )
}
