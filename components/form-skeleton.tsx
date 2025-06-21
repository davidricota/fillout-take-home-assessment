import { cn } from "@/lib/utils";

interface FormSkeletonProps {
  className?: string;
}

export function FormSkeleton({ className }: FormSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Select Dropdown Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-32 animate-pulse rounded bg-gray-200"></div>
        <div className="flex h-8 items-center justify-between rounded-lg border-2 border-dashed border-gray-200 bg-gray-100 px-3">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="h-3 w-3 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Textarea Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-28 animate-pulse rounded bg-gray-200"></div>
        <div className="h-16 rounded-lg border-2 border-dashed border-gray-200 bg-gray-100"></div>
      </div>

      {/* Radio Group Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-36 animate-pulse rounded bg-gray-200"></div>
        <div className="space-y-1.5">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
