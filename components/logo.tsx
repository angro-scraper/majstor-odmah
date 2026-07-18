import { cn } from '@/lib/utils'

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_rgba(37,99,235,0.7)]"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 3.5v13.25a3.75 3.75 0 0 0 3.75 3.75h1.5A4.75 4.75 0 0 0 16 15.75 4.75 4.75 0 0 0 11.25 11H9"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16.5" cy="6.5" r="2.5" fill="var(--cyan-accent)" />
        </svg>
      </span>
      {showText && (
        <span className="font-display text-lg font-bold tracking-tight text-navy">
          balkan<span className="text-primary">.works</span>
        </span>
      )}
    </span>
  )
}
