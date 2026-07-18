import { cn } from '@/lib/utils'
import { Signal, Wifi, BatteryFull } from 'lucide-react'

export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative w-[264px] shrink-0', className)}>
      {/* Side buttons */}
      <div
        aria-hidden="true"
        className="absolute -left-[3px] top-[104px] h-8 w-[3px] rounded-l-sm bg-gradient-to-b from-slate-400 to-slate-600"
      />
      <div
        aria-hidden="true"
        className="absolute -left-[3px] top-[152px] h-12 w-[3px] rounded-l-sm bg-gradient-to-b from-slate-400 to-slate-600"
      />
      <div
        aria-hidden="true"
        className="absolute -right-[3px] top-[132px] h-16 w-[3px] rounded-r-sm bg-gradient-to-b from-slate-400 to-slate-600"
      />

      {/* Titanium/metal outer frame */}
      <div className="relative rounded-[2.9rem] bg-gradient-to-br from-slate-300 via-slate-500 to-slate-700 p-[3px] shadow-[0_40px_90px_-30px_rgba(16,42,86,0.6)]">
        {/* Inner black bezel */}
        <div className="relative rounded-[2.75rem] bg-navy p-2.5">
          {/* Screen */}
          <div className="relative overflow-hidden rounded-[2.2rem] bg-background">
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-2.5 z-30 flex h-7 w-[92px] -translate-x-1/2 items-center justify-end gap-1.5 rounded-full bg-black px-2.5">
              <span className="size-1.5 rounded-full bg-slate-700" />
              <span className="size-2 rounded-full bg-slate-800 ring-1 ring-slate-700" />
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-6 pb-1 pt-3.5 text-[11px] font-semibold text-navy">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <Signal className="size-3" />
                <Wifi className="size-3" />
                <BatteryFull className="size-3.5" />
              </span>
            </div>

            {children}

            {/* Home indicator */}
            <div className="flex justify-center pb-2 pt-1">
              <span className="h-1 w-24 rounded-full bg-navy/25" />
            </div>

            {/* Glass reflection */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 rounded-[2.2rem] bg-gradient-to-tr from-transparent via-transparent to-white/25"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
