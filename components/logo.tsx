import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="balkan.works logo - bridge connecting the Balkans"
    >
      <defs>
        <linearGradient id="bw-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B7BFF" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#bw-gradient)" />
      
      {/* Subtle top highlight */}
      <rect x="2" y="2" width="36" height="18" rx="10" fill="#ffffff" fillOpacity="0.08" />
      
      {/* Bridge towers - left pillar */}
      <rect x="7.5" y="10" width="1.2" height="13" fill="#ffffff" opacity="0.95" />
      
      {/* Bridge towers - right pillar */}
      <rect x="31.3" y="10" width="1.2" height="13" fill="#ffffff" opacity="0.95" />
      
      {/* Main bridge deck - elegant arch */}
      <path
        d="M 8 22 Q 20 13 32 22"
        stroke="#ffffff"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.96"
      />
      
      {/* Support cables - left side */}
      <line x1="8.1" y1="10.2" x2="18" y2="18.5" stroke="#ffffff" strokeWidth="0.7" opacity="0.65" />
      <line x1="8.1" y1="10.2" x2="16" y2="20" stroke="#ffffff" strokeWidth="0.7" opacity="0.55" />
      
      {/* Support cables - right side */}
      <line x1="31.9" y1="10.2" x2="22" y2="18.5" stroke="#ffffff" strokeWidth="0.7" opacity="0.65" />
      <line x1="31.9" y1="10.2" x2="24" y2="20" stroke="#ffffff" strokeWidth="0.7" opacity="0.55" />
      
      {/* BW text on bridge - modern bold */}
      <text
        x="20"
        y="21"
        fontSize="7.5"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        fill="#2563EB"
        textAnchor="middle"
        dominantBaseline="middle"
        letterSpacing="-0.3"
      >
        BW
      </text>
      
      {/* Water line - connection line below */}
      <path
        d="M 7 26 Q 20 24.5 33 26"
        stroke="#10b981"
        strokeWidth="1"
        opacity="0.85"
        strokeLinecap="round"
      />
      
      {/* Water reflection - subtle */}
      <path
        d="M 10 28.5 Q 20 27.5 30 28.5"
        stroke="#10b981"
        strokeWidth="0.6"
        opacity="0.35"
        strokeLinecap="round"
      />
      
      {/* Green activity dot - top right */}
      <circle cx="33" cy="8" r="1.8" fill="#10b981" opacity="0.95" />
      <circle cx="33" cy="8" r="1.2" fill="#34d399" opacity="0.4" />
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
