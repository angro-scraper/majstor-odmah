import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="balkan.works logo"
    >
      <defs>
        <linearGradient id="bw-tile" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B7BFF" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* App tile background */}
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#bw-tile)" />
      {/* Subtle top highlight */}
      <rect x="1" y="1" width="38" height="18" rx="11" fill="#ffffff" fillOpacity="0.12" />
      {/* Text "bw" in center */}
      <text x="20" y="26" fontSize="22" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fill="#ffffff" textAnchor="middle" dominantBaseline="middle">
        bw
      </text>
      {/* Green dot after w */}
      <circle cx="31" cy="16" r="2.5" fill="#10b981" />
    </svg>
  )
}

export function Logo({
  className,
  showText = true,
  variant = 'default',
}: {
  className?: string
  showText?: boolean
  variant?: 'default' | 'light'
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="size-9 rounded-xl shadow-[0_6px_16px_-6px_rgba(37,99,235,0.6)]" />
      {showText && (
        <span
          className={cn(
            'font-display text-lg font-bold tracking-tight',
            variant === 'light' ? 'text-white' : 'text-navy',
          )}
        >
          balkan
          <span className={variant === 'light' ? 'text-cyan-accent' : 'text-primary'}>
            .works
          </span>
        </span>
      )}
    </span>
  )
}
