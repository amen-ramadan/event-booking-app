import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <Card
        key={index}
        className="overflow-hidden border-rose-200 dark:border-rose-800 
                    bg-gradient-to-br from-white to-rose-50/30 
                    dark:from-gray-950 dark:to-rose-950/20"
      >
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-4 bg-rose-100 dark:bg-rose-900/50" />
          <Skeleton className="h-4 w-full mb-2 bg-rose-100 dark:bg-rose-900/50" />
          <Skeleton className="h-4 w-2/3 mb-4 bg-rose-100 dark:bg-rose-900/50" />
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-20 bg-rose-100 dark:bg-rose-900/50" />
            <Skeleton className="h-4 w-24 bg-rose-100 dark:bg-rose-900/50" />
          </div>
          <Skeleton className="h-10 w-full bg-rose-100 dark:bg-rose-900/50" />
        </div>
      </Card>
    ))}
  </div>
);

export default LoadingSkeleton;
