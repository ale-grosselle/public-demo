import { getCachedSuggestedItems } from '../lib/cache';
import type { SuggestedItem } from '../lib/suggested-items';

interface SuggestedItemsProps {
  category?: string;
  count?: number;
}

function ItemCard({ item }: { item: SuggestedItem }) {
  return (
    <div className="item-card">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="item-image"
      />
      <div className="item-content">
        <h3 className="item-title">{item.title}</h3>
        <p className="item-description">{item.description}</p>
        <div className="item-footer">
          <span className="item-price">${item.price}</span>
          <div className="item-rating">
            <span>⭐</span>
            <span>{item.rating}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export default async function SuggestedItems({ category, count = 10 }: SuggestedItemsProps) {
  // This function is cached using React's cache function
  const items = await getCachedSuggestedItems(category, count);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Suggested Items
          {category && category !== 'all' && (
            <span className="text-blue-600"> - {category}</span>
          )}
        </h2>
        <p className="text-gray-600">
          Cached results using React&apos;s cache function
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No items found for the selected category.</p>
        </div>
      )}
    </div>
  );
}