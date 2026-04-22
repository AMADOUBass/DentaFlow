import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Sections Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content - Appointments Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          
          <section>
            <div className="flex items-center justify-between mb-4">
               <Skeleton className="h-8 w-48 rounded-lg" />
            </div>
            
            <div className="space-y-4">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="bg-slate-100 sm:w-32 h-32" />
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-40" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
             <Skeleton className="h-8 w-48 rounded-lg mb-4" />
             <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm divide-y">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div className="space-y-2">
                           <Skeleton className="h-5 w-32" />
                           <Skeleton className="h-3 w-24" />
                        </div>
                     </div>
                     <Skeleton className="h-6 w-20 rounded-lg" />
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
           <Card className="border-none shadow-sm rounded-[2rem] bg-slate-100 p-8 space-y-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
           </Card>
           
           <Card className="border-none shadow-sm rounded-[2rem] p-8 space-y-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
