import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg shimmer bg-white/5", className)}
      {...props}
    />
  );
}

export function AttractionCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ItineraryDaySkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-48" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-card">
      <Skeleton className="w-full h-full rounded-none" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading map...</div>
      </div>
    </div>
  );
}

export { Skeleton };
