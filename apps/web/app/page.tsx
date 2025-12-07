import { Suspense } from 'react';
import SuggestedItems from './components/SuggestedItems';


function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="item-card animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {

  return (
    <div className="space-y-8">
      <Suspense
        key={'all'}
        fallback={
          <div className="space-y-6">
            <LoadingSkeleton />
          </div>
        }
      >
        <SuggestedItems count={12} />
      </Suspense>
    </div>
  );
}
