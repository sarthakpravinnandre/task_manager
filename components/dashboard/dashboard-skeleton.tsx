'use client'

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#121212] border border-white/5 rounded-[32px] h-64" />
        ))}
      </div>
      <div className="bg-[#121212] rounded-3xl border border-white/5 h-96" />
    </div>
  )
}
