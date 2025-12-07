import { Suspense } from 'react';
import SuggestedItems from './components/SuggestedItems';
import CategoryFilter from './components/CategoryFilter';

interface PageProps {
  searchParams: {
    category?: string;
  };
}

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

export default function HomePage({ searchParams }: PageProps) {
  const category = searchParams.category;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Next.js Cache Demo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Demonstrating React&apos;s cache function with suggested items
        </p>
      </div>

      <CategoryFilter />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          🚀 Cache Demo Features:
        </h3>
        <ul className="text-yellow-700 space-y-1">
          <li>• Items are fetched using React&apos;s <code className="bg-yellow-100 px-1 rounded">cache()</code> function</li>
          <li>• Cached results persist for the duration of the request</li>
          <li>• Multiple components requesting the same data will share the cached result</li>
          <li>• Check the server console to see cache hits/misses</li>
          <li>• Random delay (500-2500ms) simulates real API calls</li>
        </ul>
      </div>

      <Suspense
        key={category || 'all'} // Force re-render when category changes
        fallback={
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Loading Suggested Items...
              </h2>
              <p className="text-gray-600">
                Fetching cached results using React&apos;s cache function
              </p>
            </div>
            <LoadingSkeleton />
          </div>
        }
      >
        <SuggestedItems category={category} count={12} />
      </Suspense>

      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          How the Cache Works:
        </h3>
        <div className="text-gray-700 space-y-2">
          <p>
            <strong>1. First Request:</strong> When you visit a page, the <code>getCachedSuggestedItems</code> function is called.
            It simulates an API call with a random delay and generates random items.
          </p>
          <p>
            <strong>2. Subsequent Requests:</strong> If the same function is called again with the same parameters
            during the same request lifecycle, it returns the cached result immediately.
          </p>
          <p>
            <strong>3. Category Changes:</strong> When you change categories, it triggers a new request with different
            parameters, so new items are generated and cached for that category.
          </p>
          <p>
            <strong>4. Server Console:</strong> Check your development server console to see when new items are
            actually fetched vs when cached results are used.
          </p>
        </div>
      </div>
    </div>
  );
}