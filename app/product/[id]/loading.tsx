import { Skeleton } from "@/components/ui/skeleton"

export default function ProductLoading() {
  return (
    <div className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-2 lg:px-6">
      <Skeleton className="aspect-square rounded-2xl" />
      <div className="space-y-5">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}
