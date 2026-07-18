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
        <linearGradient id="bw-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B7BFF" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#bw-gradient)" />
      
      {/* Subtle top highlight */}
      <rect x="2" y="2" width="36" height="18" rx="10" fill="#ffffff" fillOpacity="0.08" />
      
      {/* Letter b */}
      <text x="20" y="25" fontSize="30" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="#ffffff" textAnchor="middle" dominantBaseline="middle">
        b
      </text>
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
