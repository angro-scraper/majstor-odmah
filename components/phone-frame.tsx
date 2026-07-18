import { cn } from '@/lib/utils'

export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative w-[264px] shrink-0 rounded-[2.6rem] border border-border bg-navy p-2.5 shadow-[0_30px_80px_-30px_rgba(16,42,86,0.55)]',
        className,
      )}
    >
      <div className="absolute left-1/2 top-3.5 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-navy" />
      <div className="relative overflow-hidden rounded-[2.1rem] bg-background">
        <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-semibold text-navy">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-4 rounded-[2px] border border-navy/60" />
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
