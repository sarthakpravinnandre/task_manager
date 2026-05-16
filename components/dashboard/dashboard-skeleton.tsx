'use client'

type DashboardSkeletonProps = {
  layout?: 'developer' | 'standard'
}

export function DashboardSkeleton({ layout = 'developer' }: DashboardSkeletonProps) {
  const panelClass = 'bg-card border border-border rounded-[32px] animate-pulse'

  if (layout === 'standard') {
    return (
      <div className="space-y-8">
        <div className={`${panelClass} h-40`} />
        <div className={`${panelClass} h-96`} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className={`${panelClass} h-64 lg:col-span-1`} />
          <div className={`${panelClass} h-64 lg:col-span-1`} />
          <div className={`${panelClass} h-80 lg:col-span-2`} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${panelClass} h-64`} />
        ))}
      </div>
      <div className={`${panelClass} h-96`} />
    </div>
  )
}
