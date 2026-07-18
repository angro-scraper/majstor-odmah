import { cn } from '@/lib/utils'

export function ResponsiveContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}

export function Section({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <section className={cn('space-y-6 py-8', className)}>{children}</section>
}

export function SectionTitle({
  children,
  description,
  className,
}: {
  children: React.ReactNode
  description?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <h2 className="text-2xl font-bold tracking-tight">{children}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}
