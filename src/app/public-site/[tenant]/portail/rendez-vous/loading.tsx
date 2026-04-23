import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-lg mt-2" />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-slate-50/50">
          <Skeleton className="h-6 w-48 rounded-lg" />
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-8 flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-6 w-64 rounded-lg" />
                <Skeleton className="h-4 w-40 rounded-lg" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
