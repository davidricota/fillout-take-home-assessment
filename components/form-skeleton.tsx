import { cn } from "@/lib/utils"

interface FormSkeletonProps {
  className?: string
}

export function FormSkeleton({ className }: FormSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Text Input Skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        <div className="h-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200"></div>
      </div>

      {/* Select Dropdown Skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-between px-3">
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Textarea Skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
        <div className="h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200"></div>
      </div>

      {/* Radio Group Skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-36 animate-pulse"></div>
        <div className="space-y-1.5">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
