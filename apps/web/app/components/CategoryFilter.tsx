'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const CATEGORIES = [
  'all',
  'Electronics',
  'Books',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Automotive',
  'Toys & Games',
  'Food & Beverages',
  'Health'
];

function CategoryFilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              currentCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CategoryFilter() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-20"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <CategoryFilterContent />
    </Suspense>
  );
}