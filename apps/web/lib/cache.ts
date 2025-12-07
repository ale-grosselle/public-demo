'use server';

import { cache } from 'react';
import { generateSuggestedItems, type SuggestedItem } from './suggested-items';

// Cache the suggested items fetching function
// This will cache the result for the duration of the request
export const getCachedSuggestedItems = cache(async (category?: string, count: number = 10): Promise<SuggestedItem[]> => {
  console.log(`Fetching suggested items for category: ${category || 'all'}, count: ${count}`);

  // Generate random items
  const items = await generateSuggestedItems(count);

  // Filter by category if specified
  if (category && category !== 'all') {
    return items.filter(item =>
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  return items;
});

// Cache function for getting items by specific IDs
export const getCachedItemsByIds = cache(async (ids: string[]): Promise<SuggestedItem[]> => {
  console.log(`Fetching items by IDs: ${ids.join(', ')}`);

  // In a real app, this would fetch specific items by their IDs
  // For demo purposes, we'll generate items with the provided IDs
  const items: SuggestedItem[] = [];

  for (let i = 0; i < ids.length; i++) {
    const randomItems = await generateSuggestedItems(1);
    const item = { ...randomItems[0], id: ids[i] };
    items.push(item);
  }

  return items;
});