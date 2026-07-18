import { Skeleton } from '@/components/ui/skeleton'

export function BusinessCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <Skeleton className="mb-3 h-48 w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 flex-1 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function BusinessCardSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <BusinessCardSkeleton key={i} />
      ))}
    </div>
  )
}
