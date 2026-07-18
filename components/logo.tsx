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
      {/* Compass rose (four-point navigation star) */}
      <path
        d="M20 6 L24 16 L34 20 L24 24 L20 34 L16 24 L6 20 L16 16 Z"
        fill="#ffffff"
        fillOpacity="0.92"
      />
      {/* North needle accent (cyan) */}
      <path d="M20 6 L24 16 L16 16 Z" fill="#06B6D4" />
      {/* Connection nodes at the tips (regional reach) */}
      <circle cx="20" cy="6" r="1.7" fill="#06B6D4" />
      <circle cx="34" cy="20" r="1.7" fill="#ffffff" />
      <circle cx="20" cy="34" r="1.7" fill="#ffffff" />
      <circle cx="6" cy="20" r="1.7" fill="#ffffff" />
      {/* Compass hub */}
      <circle cx="20" cy="20" r="3.4" fill="#2563EB" />
      <circle cx="20" cy="20" r="3.4" fill="url(#bw-tile)" />
      <circle cx="20" cy="20" r="1.5" fill="#ffffff" />
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
