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
      {/* App tile */}
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#bw-tile)" />
      {/* Subtle top highlight */}
      <rect x="1" y="1" width="38" height="18" rx="11" fill="#ffffff" fillOpacity="0.12" />
      {/* Connection lines (hub -> satellites) */}
      <g stroke="#ffffff" strokeWidth="2.1" strokeLinecap="round" strokeOpacity="0.85">
        <line x1="20" y1="20" x2="20" y2="9.5" />
        <line x1="20" y1="20" x2="10.8" y2="28.4" />
        <line x1="20" y1="20" x2="29.2" y2="28.4" />
      </g>
      {/* Satellite nodes */}
      <circle cx="20" cy="9.5" r="3.1" fill="#ffffff" />
      <circle cx="10.8" cy="28.4" r="3.1" fill="#ffffff" />
      <circle cx="29.2" cy="28.4" r="3.1" fill="#06B6D4" />
      {/* Central hub */}
      <circle cx="20" cy="20" r="4.6" fill="#ffffff" />
      <circle cx="20" cy="20" r="2" fill="#2563EB" />
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
